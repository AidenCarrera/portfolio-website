// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";

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
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before trying again." },
        { status: 429 }
      );
    }

    // TODO: Add email delivery here (e.g. Resend — free 100 emails/day)
    // For now, log the submission server-side so it appears in Vercel logs
    console.log("Contact form submission:", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
