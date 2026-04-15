import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequest {
  businessId: string;
  email: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: CheckoutRequest = await request.json();

    if (!data.businessId || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify business exists and is claimed
    const business = await prisma.business.findUnique({
      where: { id: data.businessId },
      select: {
        id: true,
        name: true,
        slug: true,
        isClaimed: true,
        membershipTier: true,
        stripeCustomerId: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    if (!business.isClaimed) {
      return NextResponse.json(
        { error: "Business must be claimed before upgrading" },
        { status: 400 }
      );
    }

    if (business.membershipTier === "founding_member") {
      return NextResponse.json(
        { error: "Business is already a Founding Member" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId = business.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: data.email,
        metadata: {
          businessId: business.id,
          businessName: business.name,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await prisma.business.update({
        where: { id: business.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url:
        data.successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://heresmyguy.com"}/profile/${business.slug}?upgraded=true`,
      cancel_url:
        data.cancelUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://heresmyguy.com"}/profile/${business.slug}`,
      metadata: {
        businessId: business.id,
        businessName: business.name,
      },
      subscription_data: {
        metadata: {
          businessId: business.id,
          businessName: business.name,
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
