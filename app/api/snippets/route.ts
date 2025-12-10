// app/api/snippets/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // Fetch rows from Supabase; no generic on `from()`
    const { data, error } = await supabaseServer
    .from("music_snippets")
    .select("*")
    .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching snippets:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected error fetching snippets:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
