import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { escapeHtml } from "@/lib/html";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFoundingMemberWelcome(
  email: string,
  businessName: string,
  profileUrl: string
) {
  const safeBusinessName = escapeHtml(businessName);

  await resend.emails.send({
    from: "Here's My Guy <hello@heresmyguy.com>",
    to: email,
    subject: `Welcome to the Founding Members, ${businessName}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d4a853 0%, #b8922e 100%); padding: 32px; text-align: center;">
          <h1 style="color: #1a1a2e; margin: 0; font-size: 28px;">Welcome, Founding Member!</h1>
        </div>

        <div style="padding: 32px 24px; background: #ffffff;">
          <p style="color: #4a4a4a; line-height: 1.6; font-size: 16px;">
            Congratulations! <strong>${safeBusinessName}</strong> is now a <strong style="color: #d4a853;">Founding Member</strong> of Here's My Guy.
          </p>

          <h3 style="color: #1a1a2e; margin: 24px 0 12px 0;">Your Founding Member Benefits:</h3>
          <ul style="color: #4a4a4a; line-height: 1.8; padding-left: 20px;">
            <li><strong style="color: #d4a853;">Gold "Founding Member" badge</strong> on your listing</li>
            <li><strong>Priority placement</strong> in search results</li>
            <li><strong>Featured on our Founding Members page</strong></li>
            <li><strong>Locked-in $25/month rate</strong> for life (before prices increase)</li>
            <li><strong>Early access</strong> to new features</li>
            <li><strong>Direct support</strong> from our team</li>
          </ul>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${profileUrl}"
               style="display: inline-block; background: linear-gradient(135deg, #d4a853 0%, #b8922e 100%); color: #1a1a2e; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              View Your Enhanced Listing
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

          <p style="color: #4a4a4a; line-height: 1.6;">
            Thank you for believing in Here's My Guy from the beginning. As a Founding Member, you're helping us build the best contractor directory in the country.
          </p>

          <p style="color: #4a4a4a; line-height: 1.6;">
            Questions? Just reply to this email.<br>
            <em>— The Here's My Guy Team</em>
          </p>
        </div>

        <div style="background: #f8f7f4; padding: 16px 24px; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            Here's My Guy | Connecting homeowners with trusted contractors
          </p>
        </div>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session.metadata?.businessId;

        if (!businessId) {
          console.error("No businessId in checkout session metadata");
          break;
        }

        // Get the subscription
        const subscriptionId = session.subscription as string;

        // Update business to founding member
        const business = await prisma.business.update({
          where: { id: businessId },
          data: {
            membershipTier: "founding_member",
            membershipStartedAt: new Date(),
            stripeSubscriptionId: subscriptionId,
            isFeatured: true,
            featuredSince: new Date(),
          },
        });

        // Send welcome email
        if (session.customer_email) {
          try {
            await sendFoundingMemberWelcome(
              session.customer_email,
              business.name,
              `https://heresmyguy.com/profile/${business.slug}`
            );
          } catch (emailError) {
            console.error("Failed to send founding member welcome:", emailError);
          }
        }

        console.log(`Business ${businessId} upgraded to Founding Member`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const businessId = subscription.metadata?.businessId;

        if (!businessId) break;

        // Update subscription status
        if (subscription.status === "active") {
          await prisma.business.update({
            where: { id: businessId },
            data: {
              membershipTier: "founding_member",
              isFeatured: true,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const businessId = subscription.metadata?.businessId;

        if (!businessId) break;

        // Downgrade to claimed
        await prisma.business.update({
          where: { id: businessId },
          data: {
            membershipTier: "claimed",
            stripeSubscriptionId: null,
            isFeatured: false,
          },
        });

        console.log(`Business ${businessId} subscription cancelled`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscriptionField = (invoice as any).subscription;
        const subscriptionId = typeof subscriptionField === 'string'
          ? subscriptionField
          : subscriptionField?.id;

        if (!subscriptionId) break;

        // Find business by subscription
        const business = await prisma.business.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (business) {
          console.log(`Payment failed for business ${business.id}`);
          // Could send a payment failed email here
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
