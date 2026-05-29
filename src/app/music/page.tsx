import { MusicSnippet } from "@/types";
import { snippetsData } from "@/lib/snippetsData";
import { Music as MusicIcon } from "lucide-react";
import type { Metadata } from "next";

import ReleasedMusicSection from "@/components/music/ReleasedMusicSection";
import UpcomingSnippetsSection from "@/components/music/UpcomingSnippetsSection";
import GearSection from "@/components/music/GearSection";
import { gearData } from "@/lib/gearData";
import { getSpotifyTracks } from "@/lib/spotify";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Explore my released Spotify tracks, upcoming music snippets, and production gear.",
};

// Server component — data is fetched on the server at request/build time
export default async function Music() {
  const snippets: MusicSnippet[] = snippetsData;
  const tracks = await getSpotifyTracks();

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <MusicIcon size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Music
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore my released tracks from Spotify, upcoming snippets, and the
            gear behind them. I write, produce, mix, and master all of my music
            myself.
          </p>
        </div>

        <UpcomingSnippetsSection snippets={snippets} />
        <ReleasedMusicSection tracks={tracks} />
        <GearSection gear={gearData} />
      </div>
    </div>
  );
}
