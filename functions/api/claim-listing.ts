interface Env {
  RESEND_API_KEY: string;
  NOTIFICATION_EMAIL: string;
}

interface ClaimFormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  website: string;
  services: string[];
  otherServices: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data: ClaimFormData = await context.request.json();

    // Validate required fields
    if (!data.businessName || !data.ownerName || !data.email || !data.phone || !data.city) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MN Plumbers Directory <onboarding@resend.dev>",
        to: context.env.NOTIFICATION_EMAIL || "hello@mnplumbers.com",
        subject: `New Listing Claim: ${data.businessName}`,
        html: `
          <h2>New Listing Claim Request</h2>
          <p>A new claim has been submitted for the MN Plumbers Directory.</p>

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
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">City</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.city}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Address</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.address || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Website</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${data.website ? `<a href="${data.website}">${data.website}</a>` : "Not provided"}</td>
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
          <p style="color: #666; font-size: 12px;">This email was sent from the MN Plumbers Directory claim form.</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json() as { message?: string };
      console.error("Resend error:", errorData);
      return new Response(
        JSON.stringify({ error: `Resend error: ${errorData.message || JSON.stringify(errorData)}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Claim submission error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process claim" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
