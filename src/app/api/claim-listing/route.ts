import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";

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

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
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

    // Create ClaimRequest in database
    const claimRequest = await prisma.claimRequest.create({
      data: {
        businessId: data.businessId || null,
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
        verificationCode: generateVerificationCode(),
        status: "pending",
      },
    });

    // Determine the type of claim for the email
    const claimType = data.businessId ? "Existing Listing Claim" : "New Listing Request";
    const location = data.city && data.state ? `${data.city}, ${data.state}` : "Not specified";

    // Send notification email
    const { error } = await resend.emails.send({
      from: "Here's My Guy <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "hello@heresmyguy.com",
      subject: `${claimType}: ${data.businessName}`,
      html: `
        <h2>${claimType}</h2>
        <p>A new claim has been submitted on Here's My Guy.</p>

        <h3>Business Information</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.businessName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Owner Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.ownerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Location</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Trade</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.verticalSlug || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.address || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Website</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.website ? `<a href="${data.website}">${data.website}</a>` : "Not provided"}</td>
          </tr>
          ${data.businessId ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business ID</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${data.businessId}</td>
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
          ${data.services?.map((s: string) => `<li>${s}</li>`).join("") || ""}
          ${data.otherServices ? `<li><em>Other: ${data.otherServices}</em></li>` : ""}
        </ul>
        ` : ""}

        ${data.message ? `
        <h3>Additional Information</h3>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 4px;">${data.message}</p>
        ` : ""}

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">This email was sent from the Here's My Guy claim form.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // Still return success since we saved to database
      // Just log the email error
    }

    return NextResponse.json({
      success: true,
      claimId: claimRequest.id,
      businessName: data.businessName,
    });
  } catch (error) {
    console.error("Claim submission error:", error);
    return NextResponse.json(
      { error: "Failed to process claim" },
      { status: 500 }
    );
  }
}
