import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { escapeHtml, safeExternalUrl, safeMailtoHref, safeTelHref } from "@/lib/html";

interface ClaimFormData {
  businessId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  verticalSlug: string;
  address: string;
  website: string;
  services: string[];
  otherServices: string;
  message: string;
}

/**
 * Generate a 6-digit verification code
 */
function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification code email to user
 */
async function sendVerificationEmail(
  resend: Resend,
  email: string,
  code: string,
  businessName: string
) {
  const safeBusinessName = escapeHtml(businessName);

  await resend.emails.send({
    from: "Here's My Guy <hello@heresmyguy.com>",
    to: email,
    subject: `Your verification code: ${code}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 24px; text-align: center;">
          <h1 style="color: #d4a853; margin: 0; font-size: 24px;">Here's My Guy</h1>
        </div>

        <div style="padding: 32px 24px; background: #ffffff;">
          <h2 style="color: #1a1a2e; margin: 0 0 16px 0;">Verify your ownership of ${safeBusinessName}</h2>

          <p style="color: #4a4a4a; line-height: 1.6;">
            Enter this code to verify your claim:
          </p>

          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; background: #f5f5f5; padding: 24px; text-align: center; margin: 24px 0; border-radius: 8px; color: #1a1a2e;">
            ${code}
          </div>

          <p style="color: #888; font-size: 14px;">
            This code expires in 10 minutes.
          </p>

          <p style="color: #888; font-size: 14px;">
            If you didn't request this, you can safely ignore this email.
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

/**
 * Send admin notification for claims requiring manual review
 */
async function sendAdminNotification(
  resend: Resend,
  claimRequest: { id: string },
  data: ClaimFormData,
  reason: string
) {
  const claimType = data.businessId ? "Existing Listing Claim" : "New Listing Request";
  const location = data.city && data.state ? `${data.city}, ${data.state}` : "Not specified";
  const websiteUrl = data.website ? safeExternalUrl(data.website) : null;
  const safeServices = (data.services || []).map((service) => escapeHtml(service));
  const safeData = {
    businessName: escapeHtml(data.businessName),
    ownerName: escapeHtml(data.ownerName),
    email: escapeHtml(data.email),
    phone: escapeHtml(data.phone),
    location: escapeHtml(location),
    verticalSlug: escapeHtml(data.verticalSlug || "Not specified"),
    address: escapeHtml(data.address || "Not provided"),
    website: escapeHtml(data.website || "Not provided"),
    businessId: escapeHtml(data.businessId),
    otherServices: escapeHtml(data.otherServices),
    message: escapeHtml(data.message),
    reason: escapeHtml(reason),
  };

  await resend.emails.send({
    from: "Here's My Guy <hello@heresmyguy.com>",
    to: process.env.NOTIFICATION_EMAIL || "hello@heresmyguy.com",
    subject: `[Review Required] ${claimType}: ${data.businessName}`,
    html: `
      <h2>${claimType} - Manual Review Required</h2>
      <p><strong>Reason:</strong> ${safeData.reason}</p>
      <p>A new claim has been submitted on Here's My Guy and requires manual review.</p>

      <h3>Business Information</h3>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeData.businessName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Owner Name</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeData.ownerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><a href="${safeMailtoHref(data.email)}">${safeData.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 8px; border: 1px solid #ddd;"><a href="${safeTelHref(data.phone)}">${safeData.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Location</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeData.location}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Trade</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeData.verticalSlug}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeData.address}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Website</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${websiteUrl ? `<a href="${escapeHtml(websiteUrl)}">${safeData.website}</a>` : safeData.website}</td>
        </tr>
        ${data.businessId ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business ID</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${safeData.businessId}</td>
        </tr>
        ` : ""}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Claim ID</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${claimRequest.id}</td>
        </tr>
      </table>

      ${data.services?.length > 0 || data.otherServices ? `
      <h3>Services Offered</h3>
      <ul style="margin: 0; padding-left: 20px;">
        ${safeServices.map((s: string) => `<li>${s}</li>`).join("") || ""}
        ${data.otherServices ? `<li><em>Other: ${safeData.otherServices}</em></li>` : ""}
      </ul>
      ` : ""}

      ${data.message ? `
      <h3>Additional Information</h3>
      <p style="background: #f5f5f5; padding: 12px; border-radius: 4px;">${safeData.message}</p>
      ` : ""}

      <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">This email was sent from the Here's My Guy claim form.</p>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data: ClaimFormData = await request.json();

    // Validate required fields
    if (!data.businessName || !data.ownerName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For new listings, require city, state, and vertical
    if (!data.businessId && (!data.city || !data.state || !data.verticalSlug)) {
      return NextResponse.json(
        { error: "City, state, and trade are required for new listings" },
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

    // For existing business claims, check email match
    if (data.businessId) {
      const business = await prisma.business.findUnique({
        where: { id: data.businessId },
        select: {
          id: true,
          name: true,
          email: true,
          email2: true,
          email3: true,
        },
      });

      if (!business) {
        return NextResponse.json(
          { error: "Business not found" },
          { status: 404 }
        );
      }

      // Check if submitted email matches any email on file
      const submittedEmail = data.email.toLowerCase().trim();
      const businessEmails = [
        business.email,
        business.email2,
        business.email3,
      ]
        .filter(Boolean)
        .map((e) => e!.toLowerCase().trim());

      const emailMatches = businessEmails.includes(submittedEmail);

      if (emailMatches) {
        // Email matches - send verification code for auto-approval
        const verificationCode = generateSixDigitCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const claimRequest = await prisma.claimRequest.create({
          data: {
            businessId: data.businessId,
            email: data.email,
            phone: data.phone,
            ownerName: data.ownerName,
            businessName: data.businessName,
            city: data.city,
            state: data.state,
            verticalSlug: data.verticalSlug,
            address: data.address || null,
            website: data.website || null,
            services: data.services || [],
            otherServices: data.otherServices || null,
            message: data.message || null,
            verificationCode,
            verificationCodeExpiresAt: expiresAt,
            status: "pending_verification",
          },
        });

        // Send code to user
        try {
          await sendVerificationEmail(resend, data.email, verificationCode, business.name);
        } catch (emailError) {
          console.error("Failed to send verification email:", emailError);
        }

        return NextResponse.json({
          success: true,
          requiresVerification: true,
          claimId: claimRequest.id,
          businessName: data.businessName,
        });
      } else {
        // Email doesn't match - requires manual review
        const claimRequest = await prisma.claimRequest.create({
          data: {
            businessId: data.businessId,
            email: data.email,
            phone: data.phone,
            ownerName: data.ownerName,
            businessName: data.businessName,
            city: data.city,
            state: data.state,
            verticalSlug: data.verticalSlug,
            address: data.address || null,
            website: data.website || null,
            services: data.services || [],
            otherServices: data.otherServices || null,
            message: data.message || null,
            status: "pending_review",
            notes: "Email does not match business records - requires manual verification",
          },
        });

        // Notify admin
        try {
          await sendAdminNotification(
            resend,
            claimRequest,
            data,
            "Email does not match any email on file for this business"
          );
        } catch (emailError) {
          console.error("Failed to send admin notification:", emailError);
        }

        return NextResponse.json({
          success: true,
          requiresVerification: false,
          pendingReview: true,
          claimId: claimRequest.id,
          businessName: data.businessName,
          message: "Your claim has been submitted for review. We'll be in touch within 24-48 hours.",
        });
      }
    }

    // New listing request - requires manual review
    const claimRequest = await prisma.claimRequest.create({
      data: {
        businessId: null,
        email: data.email,
        phone: data.phone,
        ownerName: data.ownerName,
        businessName: data.businessName,
        city: data.city,
        state: data.state,
        verticalSlug: data.verticalSlug,
        address: data.address || null,
        website: data.website || null,
        services: data.services || [],
        otherServices: data.otherServices || null,
        message: data.message || null,
        status: "pending_review",
        notes: "New listing request - requires manual verification",
      },
    });

    // Notify admin
    try {
      await sendAdminNotification(
        resend,
        claimRequest,
        data,
        "New listing request"
      );
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    return NextResponse.json({
      success: true,
      requiresVerification: false,
      pendingReview: true,
      claimId: claimRequest.id,
      businessName: data.businessName,
      message: "Your listing request has been submitted for review. We'll be in touch within 24-48 hours.",
    });
  } catch (error) {
    console.error("Claim submission error:", error);
    return NextResponse.json(
      { error: "Failed to process claim" },
      { status: 500 }
    );
  }
}
