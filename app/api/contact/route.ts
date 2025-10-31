import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { ContactSubmission } from "@/types";

// Simple in-memory rate limiter
const submissionTimestamps = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const MAX_MESSAGE_LENGTH = 1000; // Max characters for message

export async function POST(req: NextRequest) {
  try {
    const body: Partial<ContactSubmission> = await req.json();
    let { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Trim inputs
    name = name.trim();
    email = email.trim();
    message = message.trim();

    // Basic validation
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message is too long. Max ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Rate limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const now = Date.now();
    const timestamps = submissionTimestamps.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);

    if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a moment before trying again." },
        { status: 429 }
      );
    }

    recent.push(now);
    submissionTimestamps.set(ip, recent);

    // Duplicate check
    const { data: existing } = await supabaseServer
      .from("contact_submissions")
      .select("id")
      .eq("email", email)
      .eq("message", message)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "You already submitted this message." },
        { status: 409 }
      );
    }

    // Insert into Supabase
    const { error } = await supabaseServer
      .from("contact_submissions")
      .insert([{ name, email, message }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Contact form submitted successfully:", { name, email, message });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
