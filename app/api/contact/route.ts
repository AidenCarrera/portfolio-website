// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // use anon client, not service key
import { ContactSubmission } from "@/types";
import { redis } from "@/lib/redis"; // Upstash REST Redis client

const WINDOW_SECONDS = 60; // 1 minute
const MAX_SUBMISSIONS_PER_WINDOW = 3;
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
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Rate limiting by IP using Upstash REST Redis
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const key = `contact_rate:${ip}`;

    try {
      // Increment counter in Redis
      const submissions = await redis.incr(key);

      // Set TTL if first submission
      if (submissions === 1) {
        await redis.expire(key, WINDOW_SECONDS);
      }

      // Check limit
      if (submissions > MAX_SUBMISSIONS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many submissions. Please wait before trying again." },
          { status: 429 }
        );
      }
    } catch (redisError) {
      console.error("Redis error:", redisError);
      // Optionally: allow request to proceed in degraded mode
      // or return: NextResponse.json({ error: "Rate limiting unavailable." }, { status: 503 });
    }
    // Duplicate submission check
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

    console.log("Contact form submitted successfully");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
