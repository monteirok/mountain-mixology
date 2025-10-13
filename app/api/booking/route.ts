'use server'

import { google } from "googleapis";
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

const DRIVE_SCOPE = ["https://www.googleapis.com/auth/drive.file"];

const sanitizeFileFragment = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "submission";

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

    const jsonContent = JSON.stringify(payload, null, 2);
    const timestamp = Date.now();
    const safeName = sanitizeFileFragment(name);
    const fileName = `booking_${timestamp}_${safeName}.json`;

    const folderId = getEnvOrThrow("GOOGLE_DRIVE_FOLDER_ID");
    const serviceAccountEmail = getEnvOrThrow("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const serviceAccountKeyBase64 = getEnvOrThrow(
      "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64"
    );

    const decodedKey = Buffer.from(
      serviceAccountKeyBase64,
      "base64"
    ).toString("utf-8");
    const keyJson = JSON.parse(decodedKey) as { private_key?: string };

    if (!keyJson.private_key) {
      throw new Error("Invalid service account key: missing private_key.");
    }

    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: keyJson.private_key,
      scopes: DRIVE_SCOPE,
    });

    const drive = google.drive({ version: "v3", auth });

    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
        mimeType: "application/json",
      },
      media: {
        mimeType: "application/json",
        body: jsonContent,
      },
      fields: "id,name,webViewLink,webContentLink",
    });

    const driveFile = driveResponse.data;

    const resendApiKey = getEnvOrThrow("RESEND_API_KEY");
    const toAddress =
      process.env.EMAIL_TO ?? "mountainmixologyca@gmail.com";

    const emailSubject = `New Booking Request: ${name}`;
    const summaryLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      eventDate ? `Event Date: ${eventDate}` : null,
      guests ? `Guests: ${guests}` : null,
      venue ? `Venue: ${venue}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bookings <no-reply@mountainmixology.ca>",
        to: [toAddress],
        subject: emailSubject,
        text: `A new booking request was received.\n\n${summaryLines}\n\nFull details are attached as JSON.`,
        attachments: [
          {
            filename: fileName,
            content: Buffer.from(jsonContent).toString("base64"),
            contentType: "application/json",
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Failed to send email: ${errorText}`);
    }

    return NextResponse.json({ ok: true, driveFile }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
