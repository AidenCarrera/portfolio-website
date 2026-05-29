// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 60_000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;
const MAX_MESSAGE_LENGTH = 1000;

// In-memory rate limiter — resets on server restart, sufficient for a portfolio site
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    // Required field check
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Trim and sanitize
    name = name.trim();
    email = email.trim().toLowerCase();
    message = message.trim();

    // Validate message length
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 },
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before trying again." },
        { status: 429 },
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "aiden.carrera05@gmail.com", // Your verified owner email
      subject: `New Message from ${name}`,
      replyTo: email, // Allows you to just click "Reply" in your email client
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #000;">New Portfolio Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 500 },
      );
    }

    console.log("Contact form submission sent successfully:", data?.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
