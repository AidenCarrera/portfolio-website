import type { MusicTrack } from "@/types";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_ARTIST_ID = process.env.SPOTIFY_ARTIST_ID?.trim();

interface SpotifyAlbum {
  id: string;
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
}

// Renew slightly early so a token is never handed out on the edge of expiry.
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;

// Kept out of the Next data cache: that cache serves stale entries while
// revalidating in the background, which would eventually hand out an expired
// token and 401. An expiry-aware in-memory cache can't, and keeps the
// credential off disk.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getSpotifyAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET env variables",
    );
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
          "base64",
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    throw new Error(
      `Failed to fetch Spotify access token (${tokenRes.status} ${tokenRes.statusText})`,
    );
  }
  const tokenData = await tokenRes.json();

  cachedToken = {
    value: tokenData.access_token,
    expiresAt:
      Date.now() +
      (tokenData.expires_in ?? 3600) * 1000 -
      TOKEN_EXPIRY_MARGIN_MS,
  };

  return cachedToken.value;
}

export async function getSpotifyTracks(): Promise<MusicTrack[]> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_ARTIST_ID) {
    return [];
  }

  try {
    const accessToken = await getSpotifyAccessToken();

    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${encodeURIComponent(SPOTIFY_ARTIST_ID)}/albums?include_groups=album,single&market=US&limit=50`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 3600 },
      },
    );

    if (!albumsRes.ok) {
      throw new Error(
        `Failed to fetch albums from Spotify (${albumsRes.status} ${albumsRes.statusText}): ${await albumsRes.text()}`,
      );
    }
    const albumsData: { items: SpotifyAlbum[] } = await albumsRes.json();

    const trackPromises = albumsData.items.map(async (album) => {
      const tracksRes = await fetch(
        `https://api.spotify.com/v1/albums/${album.id}/tracks?market=US`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          next: { revalidate: 3600 },
        },
      );

      if (!tracksRes.ok) {
        throw new Error(
          `Failed to fetch tracks for album ${album.name} (${tracksRes.status} ${tracksRes.statusText})`,
        );
      }

      const tracksData: { items: SpotifyTrack[] } = await tracksRes.json();

      return tracksData.items.map<MusicTrack>((track) => ({
        id: track.id,
        title: track.name,
        spotify_embed_url: `https://open.spotify.com/embed/track/${track.id}`,
      }));
    });

    // allSettled so one unavailable album doesn't discard every other track.
    const results = await Promise.allSettled(trackPromises);
    for (const result of results) {
      if (result.status === "rejected") {
        console.error("Spotify API Helper Error:", result.reason);
      }
    }

    return results
      .filter((result) => result.status === "fulfilled")
      .flatMap((result) => result.value);
  } catch (err) {
    console.error("Spotify API Helper Error:", err);
    return [];
  }
}
