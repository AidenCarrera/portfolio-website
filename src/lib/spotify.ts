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

// Spotify's client-credentials tokens are valid for 3600s. Rotating the cache
// key on a shorter window guarantees a token is at most this old when served.
const TOKEN_WINDOW_MS = 45 * 60 * 1000;

async function getSpotifyAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET env variables",
    );
  }

  // Dummy `w` parameter forces Next cache-key rotation so stale-while-revalidate 
  // fetches a fresh token before the old one expires and returns 401s.
  const window = Math.floor(Date.now() / TOKEN_WINDOW_MS);

  const tokenRes = await fetch(`https://accounts.spotify.com/api/token?w=${window}`, {
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
    next: { revalidate: 3600 },
  });

  if (!tokenRes.ok) {
    throw new Error(
      `Failed to fetch Spotify access token (${tokenRes.status} ${tokenRes.statusText})`,
    );
  }
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
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
