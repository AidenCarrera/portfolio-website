"use client";

import { Music as MusicIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MusicTrack, MusicSnippet, GearItem } from "@/types";
import ReleasedMusicSection from "@/components/music/ReleasedMusicSection";
import UpcomingSnippetsSection from "@/components/music/UpcomingSnippetsSection";
import GearSection from "@/components/music/GearSection";

export default function Music() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [snippets, setSnippets] = useState<MusicSnippet[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);

  useEffect(() => {
    (async () => {
      // Fetch Spotify tracks
      const spotifyRes = await fetch("/api/spotify-tracks");
      const spotifyTracks = await spotifyRes.json();
      setTracks(spotifyTracks);

      // Fetch snippets via API
      const snippetsRes = await fetch("/api/snippets");
      const snippetsData: MusicSnippet[] = await snippetsRes.json();
      setSnippets(snippetsData);

      // Fetch gear directly (optional: could also make an API for gear)
      const { data: gearData } = await supabase.from("gear_items").select("*").order("name");
      if (gearData) setGear(gearData);
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
            Explore my released tracks from Spotify, upcoming snippets, and the gear that brings it all to life.
          </p>
        </div>

        <ReleasedMusicSection tracks={tracks} />
        <UpcomingSnippetsSection snippets={snippets} />
        <GearSection gear={gear} />
      </div>
    </div>
  );
}
