"use client";

import { Music as MusicIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { MusicTrack, MusicSnippet, GearItem } from "@/types";
import ReleasedMusicSection from "@/components/music/ReleasedMusicSection";
import UpcomingSnippetsSection from "@/components/music/UpcomingSnippetsSection";
import GearSection from "@/components/music/GearSection";

export default function Music() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [snippets, setSnippets] = useState<MusicSnippet[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setError(null); // Clear any previous errors
      try {
        // Fetch all data in parallel
        const [spotifyRes, snippetsRes, gearRes] = await Promise.all([
          fetch("/api/spotify-tracks"),
          fetch("/api/snippets"),
          fetch("/api/gear"),
        ]);

        if (!spotifyRes.ok || !snippetsRes.ok || !gearRes.ok) {
          throw new Error("One or more API requests failed");
        }

        const [spotifyTracks, snippetsData, gearData] = await Promise.all([
          spotifyRes.json(),
          snippetsRes.json(),
          gearRes.json(),
        ]);

        setTracks(spotifyTracks);
        setSnippets(snippetsData);
        setGear(gearData);
      } catch (err) {
        console.error("Failed to fetch music data:", err);
        setError((err as Error).message ?? "Failed to load music data");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <MusicIcon size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Music</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore my released tracks from Spotify, upcoming snippets, and the gear behind them. I write, produce, mix, and master all of my music myself.
          </p>
        </div>

        {error && (
          <div className="mb-8 relative bg-red-900/50 border border-red-500 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-1 text-sm text-red-200">
                {error}
              </div>
              <button 
                onClick={() => setError(null)}
                className="ml-4 text-red-200 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <ReleasedMusicSection tracks={tracks} />
        <UpcomingSnippetsSection snippets={snippets} />
        <GearSection gear={gear} />
      </div>
    </div>
  );
}
