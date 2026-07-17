import type { MusicTrack } from "@/types";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const ARTIST_ID = "1LgE8yhi5cPt1uBQPzaRAe";

// Static fallback preserves released music when Spotify is unavailable.
const FALLBACK_SPOTIFY_TRACKS: MusicTrack[] = [
  {
    id: "14UiomCSXMRsMVINVZmK4O",
    title: "Rain From 93",
    spotify_embed_url:
      "https://open.spotify.com/embed/track/14UiomCSXMRsMVINVZmK4O",
  },
];

function getFallbackSpotifyTracks(): MusicTrack[] {
  return FALLBACK_SPOTIFY_TRACKS.map((track) => ({ ...track }));
}

interface SpotifyAlbum {
  id: string;
  name: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
}

async function getSpotifyAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET env variables",
    );
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
    next: { revalidate: 3600 },
  });

  if (!tokenRes.ok) throw new Error("Failed to fetch Spotify access token");
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export async function getSpotifyTracks(): Promise<MusicTrack[]> {
  try {
    const accessToken = await getSpotifyAccessToken();

    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single&market=US&limit=50`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        next: { revalidate: 3600 },
      },
    );

    if (!albumsRes.ok) throw new Error("Failed to fetch albums from Spotify");
    const albumsData: { items: SpotifyAlbum[] } = await albumsRes.json();

    const trackPromises = albumsData.items.map(async (album) => {
      const tracksRes = await fetch(
        `https://api.spotify.com/v1/albums/${album.id}/tracks?market=US`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          next: { revalidate: 3600 },
        },
      );

      if (!tracksRes.ok)
        throw new Error(`Failed to fetch tracks for album ${album.name}`);

      const tracksData: { items: SpotifyTrack[] } = await tracksRes.json();

      return tracksData.items.map<MusicTrack>((track) => ({
        id: track.id,
        title: track.name,
        spotify_embed_url: `https://open.spotify.com/embed/track/${track.id}`,
      }));
    });

    const allTracks = (await Promise.all(trackPromises)).flat();
    return allTracks.length > 0 ? allTracks : getFallbackSpotifyTracks();
  } catch (err) {
    console.error("Spotify API Helper Error:", err);
    return getFallbackSpotifyTracks();
  }
}
