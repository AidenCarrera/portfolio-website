import { Music as MusicIcon } from "lucide-react";
import type { Metadata } from "next";

import ReleasedMusicSection from "@/components/music/ReleasedMusicSection";
import UpcomingSnippetsSection from "@/components/music/UpcomingSnippetsSection";
import GearSection from "@/components/music/GearSection";
import { getSpotifyTracks } from "@/lib/spotify";
import { getSanityGearItems, getSanityMusic } from "@/sanity/data";
import type { MusicSnippet } from "@/types";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Explore my upcoming music snippets, released Spotify tracks, and production gear.",
  alternates: {
    canonical: "/music",
  },
};

export default async function Music() {
  const [tracks, sanityMusic, gearItems] = await Promise.all([
    getSpotifyTracks(),
    getSanityMusic(),
    getSanityGearItems(),
  ]);
  const snippets: MusicSnippet[] = sanityMusic
    .filter((item) => item.audio?.asset?.url)
    .map((item) => ({
      id: item._id,
      title: item.name,
      audio_url: item.audio.asset.url,
    }));

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-brand to-brand-dark mb-6">
            <MusicIcon size={32} className="text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Music
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Explore my upcoming snippets, released tracks from Spotify, and the gear
            behind them. I write, produce, mix, and master all of my music myself.
          </p>
        </div>

        <UpcomingSnippetsSection snippets={snippets} />
        <ReleasedMusicSection tracks={tracks} />
        <GearSection gear={gearItems} />
      </div>
    </div>
  );
}
