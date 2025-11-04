"use server";

import { NextResponse } from "next/server";
import { redis } from "@/lib/redis"; // Upstash REST Redis client

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const ARTIST_ID = "1LgE8yhi5cPt1uBQPzaRAe";

interface SpotifyAlbum {
  id: string;
  name: string;
  release_date: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
}

interface TrackResponse {
  id: string;
  title: string;
  spotify_embed_url: string;
  release_date: string;
}

async function getSpotifyAccessToken(): Promise<string> {
  const cachedToken = await redis.get("spotify_access_token");
  if (cachedToken) return cachedToken as string;

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!tokenRes.ok) throw new Error("Failed to fetch Spotify access token");

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token as string;

  // Cache token for 55 minutes
  await redis.set("spotify_access_token", accessToken, { ex: 55 * 60 });

  return accessToken;
}

export async function GET() {
  try {
    const accessToken = await getSpotifyAccessToken();

    // Fetch albums & singles
    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&market=US&limit=50`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!albumsRes.ok) throw new Error("Failed to fetch albums from Spotify");

    const albumsData: { items: SpotifyAlbum[] } = await albumsRes.json();

    // Fetch tracks for each album
    const trackPromises = albumsData.items.map(async (album) => {
      const tracksRes = await fetch(
        `https://api.spotify.com/v1/albums/${album.id}/tracks?market=US`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!tracksRes.ok)
        throw new Error(`Failed to fetch tracks for album ${album.name}`);

      const tracksData: { items: SpotifyTrack[] } = await tracksRes.json();

      return tracksData.items.map<TrackResponse>((track) => ({
        id: track.id,
        title: track.name,
        spotify_embed_url: `https://open.spotify.com/embed/track/${track.id}`,
        release_date: album.release_date,
      }));
    });

    const allTracks = (await Promise.all(trackPromises)).flat();

    return NextResponse.json(allTracks);
  } catch (err) {
    console.error("Spotify API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch Spotify tracks" },
      { status: 500 }
    );
  }
}
