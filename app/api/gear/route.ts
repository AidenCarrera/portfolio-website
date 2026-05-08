// app/api/gear/route.ts
import { NextResponse } from "next/server";
import { gearData } from "@/lib/gearData";

export async function GET() {
  try {
    // Return the static gear data instead of fetching from a database
    return NextResponse.json(gearData);
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
