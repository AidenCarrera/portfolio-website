import type { Metadata } from "next";

import PageHeader from "@/components/common/PageHeader";
import ReleasedMusicSection from "@/components/music/ReleasedMusicSection";
import UpcomingSnippetsSection from "@/components/music/UpcomingSnippetsSection";
import GearSection from "@/components/music/GearSection";
import { getSpotifyTracks } from "@/lib/spotify";
import { CONTAINER } from "@/lib/styles";
import { getSanityGearItems, getSanityMusic } from "@/sanity/content";
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
    <div className="pb-24 sm:pb-32">
      <PageHeader title="Music">
        Explore my upcoming snippets, released tracks from Spotify, and the gear
        behind them. I write, produce, mix, and master all of my music myself.
      </PageHeader>

      <div className={`${CONTAINER} space-y-28 sm:space-y-36`}>
        <UpcomingSnippetsSection snippets={snippets} />
        <ReleasedMusicSection tracks={tracks} />
        <GearSection gear={gearItems} />
      </div>
    </div>
  );
}
