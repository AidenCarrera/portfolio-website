// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // use anon client, not service key
import { ContactSubmission } from "@/types";

// Simple in-memory rate limiter (temporary; resets when server restarts)
const submissionTimestamps = new Map<string, number[]>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const MAX_MESSAGE_LENGTH = 1000; // Max characters for message

export async function POST(req: NextRequest) {
  try {
    const body: Partial<ContactSubmission> = await req.json();
    let { name, email, message } = body;

    // Basic required field check
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Trim and sanitize
    name = name.trim();
    email = email.trim().toLowerCase();
    message = message.trim();

    // Validate inputs
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message exceeds ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Rate limiting by IP
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const now = Date.now();

    const timestamps = submissionTimestamps.get(ip) || [];
    const recent = timestamps.filter((t) => now - t < WINDOW_MS);

    if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait before trying again." },
        { status: 429 }
      );
    }

    recent.push(now);
    submissionTimestamps.set(ip, recent);

    // Duplicate submission check (safe under anon key if RLS allows)
    const { data: existing, error: selectError } = await supabase
      .from("contact_submissions")
      .select("id")
      .eq("email", email)
      .eq("message", message)
      .limit(1);

    if (selectError) {
      console.error("Supabase select error:", selectError);
      return NextResponse.json({ error: "Database read error." }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "Duplicate submission detected." },
        { status: 409 }
      );
    }

    // Insert new submission
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert([{ name, email, message }]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Database write error." }, { status: 500 });
    }

    console.log("Contact form submitted:", { name, email });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
