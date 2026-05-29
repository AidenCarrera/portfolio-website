import { NextResponse } from "next/server";
import { getSpotifyTracks } from "@/lib/spotify";

export const revalidate = 3600;

export async function GET() {
  try {
    const allTracks = await getSpotifyTracks();
    return NextResponse.json(allTracks);
  } catch (err) {
    console.error("Spotify API Route Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Spotify tracks" },
      { status: 500 },
    );
  }
}
