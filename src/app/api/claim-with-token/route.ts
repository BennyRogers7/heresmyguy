import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { escapeHtml } from "@/lib/html";

interface TokenClaimData {
  token: string;
  ownerName: string;
  email: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data: TokenClaimData = await request.json();

    // Validate required fields
    if (!data.token || !data.ownerName || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Find business by token
    const business = await prisma.business.findUnique({
      where: { claimToken: data.token },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Invalid or expired claim token" },
        { status: 404 }
      );
    }

    if (business.isClaimed) {
      return NextResponse.json(
        { error: "This business has already been claimed" },
        { status: 400 }
      );
    }

    // Auto-approve: Mark as claimed immediately
    await prisma.business.update({
      where: { id: business.id },
      data: {
        isClaimed: true,
        isVerified: true,
        claimedAt: new Date(),
        claimedBy: data.email,
        email: business.email || data.email, // Preserve existing email or use provided
        phone: business.phone || data.phone || null, // Preserve existing phone or use provided
        claimToken: null, // Invalidate token after use (one-time)
      },
    });

    // Create claim record for tracking
    await prisma.claimRequest.create({
      data: {
        businessId: business.id,
        email: data.email,
        phone: data.phone || null,
        ownerName: data.ownerName,
        businessName: business.name,
        city: business.city,
        state: business.state,
        verticalSlug: business.verticalSlug,
        status: "approved",
        verifiedAt: new Date(),
        notes: "Claimed via direct token (email outreach)",
      },
    });

    // Send confirmation email to business owner
    const profileUrl = `https://heresmyguy.com/profile/${business.slug}`;
    const ownerName = escapeHtml(data.ownerName);
    const businessName = escapeHtml(business.name);

    try {
      await resend.emails.send({
        from: "Here's My Guy <hello@heresmyguy.com>",
        to: data.email,
        subject: `Your listing for ${business.name} is now verified!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1a2e; padding: 24px; text-align: center;">
              <h1 style="color: #d4a853; margin: 0; font-size: 24px;">Here's My Guy</h1>
            </div>

            <div style="padding: 32px 24px; background: #ffffff;">
              <h2 style="color: #1a1a2e; margin: 0 0 16px 0;">Congratulations! Your listing is verified.</h2>

              <p style="color: #4a4a4a; line-height: 1.6;">
                Hi ${ownerName},
              </p>

              <p style="color: #4a4a4a; line-height: 1.6;">
                Your listing for <strong>${businessName}</strong> on Here's My Guy is now verified and active.
              </p>

              <h3 style="color: #1a1a2e; margin: 24px 0 12px 0;">What this means for you:</h3>
              <ul style="color: #4a4a4a; line-height: 1.8; padding-left: 20px;">
                <li>Your listing displays a <strong style="color: #22c55e;">Verified Owner</strong> badge</li>
                <li>You appear higher in search results</li>
                <li>Customers can see you're a legitimate, verified business</li>
                <li>You stand out from unverified competitors</li>
              </ul>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${profileUrl}"
                   style="display: inline-block; background: #d4a853; color: #1a1a2e; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  View Your Listing
                </a>
              </div>

              <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">

              <p style="color: #4a4a4a; line-height: 1.6;">
                Have questions? Just reply to this email and we'll help you out.
              </p>

              <p style="color: #4a4a4a; line-height: 1.6;">
                Thanks for being part of Here's My Guy!<br>
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
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails - the claim is still valid
    }

    return NextResponse.json({
      success: true,
      businessSlug: business.slug,
      businessName: business.name,
    });
  } catch (error) {
    console.error("Token claim error:", error);
    return NextResponse.json(
      { error: "Failed to process claim" },
      { status: 500 }
    );
  }
}
