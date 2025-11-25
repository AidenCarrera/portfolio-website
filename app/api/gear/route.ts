// app/api/gear/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; // service key or server client

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("gear_items")
      .select("*")
      .order("name");

    if (error) {
      console.error("Supabase fetch gear error:", error);
      return NextResponse.json({ error: "Failed to fetch gear" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
