

import { NextRequest, NextResponse } from "next/server";

type BookingPayload = {
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  guests?: string;
  venue?: string;
  notes?: string;
  submittedAt: string;
};

const getEnvOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();

    const name = typeof raw?.name === "string" ? raw.name.trim() : "";
    const email = typeof raw?.email === "string" ? raw.email.trim() : "";
    const phone =
      typeof raw?.phone === "string" ? raw.phone.trim() : undefined;
    const eventDate =
      typeof raw?.eventDate === "string" ? raw.eventDate.trim() : undefined;
    const guests =
      typeof raw?.guests === "string" ? raw.guests.trim() : undefined;
    const venue =
      typeof raw?.venue === "string" ? raw.venue.trim() : undefined;
    const notes =
      typeof raw?.notes === "string" ? raw.notes.trim() : undefined;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    const payload: BookingPayload = {
      name,
      email,
      phone,
      eventDate,
      guests,
      venue,
      notes,
      submittedAt: new Date().toISOString(),
    };

    const resendApiKey = getEnvOrThrow("RESEND_API_KEY");
    const toAddress =
      process.env.EMAIL_TO ?? "mountainmixologyca@gmail.com";

    const emailSubject = `New Booking Request: ${name}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailSubject}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 24px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 24px 32px;
    }
    .intro {
      font-size: 15px;
      color: #475569;
      margin-bottom: 20px;
    }
    .details-grid {
      display: grid;
      gap: 16px;
      background: #f1f5f9;
      padding: 20px;
      border-radius: 10px;
    }
    .detail-item {
      margin-bottom: 4px;
    }
    .detail-item:last-child {
      margin-bottom: 0;
    }
    .label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 2px;
      display: block;
    }
    .value {
      font-size: 15px;
      font-weight: 500;
      color: #0f172a;
    }
    .notes-box {
      margin-top: 20px;
      padding: 16px;
      background: #ffffff;
      border-left: 4px solid #3b82f6;
      border-radius: 4px;
    }
    .footer {
      padding: 16px;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Mountain Mixology</h1>
    </div>
    <div class="content">
      <p class="intro">A new booking request has been received from the website.</p>
      
      <div class="details-grid">
        <div class="detail-item">
          <span class="label">Client Name</span>
          <div class="value">${name}</div>
        </div>
        
        <div class="detail-item">
          <span class="label">Email Address</span>
          <div class="value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>
        </div>
        
        <div class="detail-item">
          <span class="label">Phone Number</span>
          <div class="value">${phone || "N/A"}</div>
        </div>
        
        <div class="detail-item">
          <span class="label">Event Date</span>
          <div class="value">${eventDate || "N/A"}</div>
        </div>
        
        <div class="detail-item">
          <span class="label">Guest Count</span>
          <div class="value">${guests || "N/A"}</div>
        </div>
        
        <div class="detail-item">
          <span class="label">Venue</span>
          <div class="value">${venue || "N/A"}</div>
        </div>
      </div>

      ${notes ? `
      <div class="notes-box">
        <span class="label">Client Notes</span>
        <div class="value">${notes}</div>
      </div>
      ` : ""}
    </div>
    <div class="footer">
      Submitted on ${new Date(payload.submittedAt).toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short'
    })}
    </div>
  </div>
</body>
</html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Mountain Mixology <no-reply@mountainmixology.ca>",
        to: [toAddress],
        subject: emailSubject,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
