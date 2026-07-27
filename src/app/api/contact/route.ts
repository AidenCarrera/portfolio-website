import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL, CONTACT_LIMITS } from "@/lib/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

const WINDOW_MS = 60_000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);
}

// Per-instance limits do not persist across restarts or deployments.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Sweeping on every call bounds the map to IPs active in the current window.
  for (const [trackedIp, tracked] of rateLimitMap) {
    if (now > tracked.resetAt) {
      rateLimitMap.delete(trackedIp);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return false;
  }

  entry.count++;
  return true;
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export async function POST(req: NextRequest) {
  try {
    // Gate before parsing so malformed payloads cannot bypass the limiter.
    if (!checkRateLimit(getClientIp(req))) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before trying again." },
        { status: 429 },
      );
    }

    // A body that will not parse is the caller's mistake, not a server fault.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const fields = body as Record<string, unknown>;
    if (
      typeof fields.name !== "string" ||
      typeof fields.email !== "string" ||
      typeof fields.message !== "string"
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const name = fields.name.trim();
    const email = fields.email.trim().toLowerCase();
    const message = fields.message.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (
      name.length > CONTACT_LIMITS.name ||
      email.length > CONTACT_LIMITS.email ||
      message.length > CONTACT_LIMITS.message
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
    const subjectName = name.replace(/[\r\n]+/g, " ");

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      subject: `New Message from ${subjectName}`,
      replyTo: email,
      text: `New Portfolio Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #000;">New Portfolio Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
            ${safeMessage}
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
