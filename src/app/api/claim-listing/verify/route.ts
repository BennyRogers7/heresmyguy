import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { escapeHtml } from "@/lib/html";

interface VerifyData {
  claimId: string;
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data: VerifyData = await request.json();

    if (!data.claimId || !data.code) {
      return NextResponse.json(
        { error: "Missing claim ID or verification code" },
        { status: 400 }
      );
    }

    // Find the claim request
    const claimRequest = await prisma.claimRequest.findUnique({
      where: { id: data.claimId },
    });

    if (!claimRequest) {
      return NextResponse.json(
        { error: "Claim request not found" },
        { status: 404 }
      );
    }

    // Check status
    if (claimRequest.status !== "pending_verification") {
      return NextResponse.json(
        { error: "This claim is not awaiting verification" },
        { status: 400 }
      );
    }

    // Check expiration
    if (
      claimRequest.verificationCodeExpiresAt &&
      new Date() > claimRequest.verificationCodeExpiresAt
    ) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify code
    if (claimRequest.verificationCode !== data.code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Get the business
    if (!claimRequest.businessId) {
      return NextResponse.json(
        { error: "No business associated with this claim" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: claimRequest.businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Success! Auto-approve the claim
    await prisma.$transaction([
      // Update claim request
      prisma.claimRequest.update({
        where: { id: data.claimId },
        data: {
          status: "approved",
          verifiedAt: new Date(),
        },
      }),

      // Update business
      prisma.business.update({
        where: { id: claimRequest.businessId },
        data: {
          isClaimed: true,
          isVerified: true,
          claimedAt: new Date(),
          claimedBy: claimRequest.email,
        },
      }),
    ]);

    // Send confirmation email
    const profileUrl = `https://heresmyguy.com/profile/${business.slug}`;
    const ownerName = claimRequest.ownerName ? ` ${escapeHtml(claimRequest.ownerName)}` : "";
    const businessName = escapeHtml(business.name);

    try {
      await resend.emails.send({
        from: "Here's My Guy <hello@heresmyguy.com>",
        to: claimRequest.email!,
        subject: `Your listing for ${business.name} is now verified!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1a1a2e; padding: 24px; text-align: center;">
              <h1 style="color: #d4a853; margin: 0; font-size: 24px;">Here's My Guy</h1>
            </div>

            <div style="padding: 32px 24px; background: #ffffff;">
              <h2 style="color: #1a1a2e; margin: 0 0 16px 0;">Congratulations! Your listing is verified.</h2>

              <p style="color: #4a4a4a; line-height: 1.6;">
                Hi${ownerName},
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
    }

    return NextResponse.json({
      success: true,
      businessSlug: business.slug,
      businessName: business.name,
      message: "Your listing has been verified!",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify claim" },
      { status: 500 }
    );
  }
}
