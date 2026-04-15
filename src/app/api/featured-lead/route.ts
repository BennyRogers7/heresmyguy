import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { escapeHtml, safeMailtoHref, safeTelHref } from "@/lib/html";

interface FeaturedLeadData {
  businessName: string;
  email: string;
  phone: string;
  state?: string;
  verticalSlug?: string;
}

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data: FeaturedLeadData = await request.json();

    // Validate required fields
    if (!data.businessName || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Business name, email, and phone are required" },
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

    // Create FeaturedLead in database
    const featuredLead = await prisma.featuredLead.create({
      data: {
        businessName: data.businessName,
        email: data.email,
        phone: data.phone,
        state: data.state || null,
        verticalSlug: data.verticalSlug || null,
        status: "new",
      },
    });

    const businessName = escapeHtml(data.businessName);
    const email = escapeHtml(data.email);
    const phone = escapeHtml(data.phone);
    const state = escapeHtml(data.state || "Not specified");
    const verticalSlug = escapeHtml(data.verticalSlug || "Not specified");

    // Send notification email
    const { error } = await resend.emails.send({
      from: "Here's My Guy <onboarding@resend.dev>",
      to: process.env.NOTIFICATION_EMAIL || "hello@heresmyguy.com",
      subject: `Featured Listing Interest: ${data.businessName}`,
      html: `
        <h2>New Featured Listing Lead</h2>
        <p>Someone is interested in becoming a featured contractor on Here's My Guy.</p>

        <h3>Lead Information</h3>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Business Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${businessName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="${safeMailtoHref(data.email)}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 8px; border: 1px solid #ddd;"><a href="${safeTelHref(data.phone)}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">State</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${state}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Trade</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${verticalSlug}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Lead ID</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${featuredLead.id}</td>
          </tr>
        </table>

        <h3>Next Steps</h3>
        <ol>
          <li>Reach out to discuss founding member pricing</li>
          <li>Verify their listing is claimed</li>
          <li>Process featured upgrade</li>
        </ol>

        <hr style="margin: 24px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">This email was sent from the Here's My Guy featured listing form.</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      // Still return success since we saved to database
    }

    return NextResponse.json({
      success: true,
      leadId: featuredLead.id,
    });
  } catch (error) {
    console.error("Featured lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
