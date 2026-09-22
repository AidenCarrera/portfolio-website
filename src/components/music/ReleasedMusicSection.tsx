import { Disc3 } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import type { MusicTrack } from "@/types";

interface ReleasedMusicSectionProps {
  tracks: MusicTrack[];
}

export default function ReleasedMusicSection({
  tracks,
}: ReleasedMusicSectionProps) {
  return (
    <section aria-labelledby="released-heading">
      <Reveal>
        <SectionHeading title="Released Music" id="released-heading" />
      </Reveal>

      {tracks.length > 0 ? (
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {tracks.map((track, position) => (
            <li key={track.id}>
              <Reveal delay={(position % 2) * 0.06}>
                <div className="relative panel rounded-2xl p-2 transition-transform duration-500 ease-out-expo hover:-translate-y-0.5">
                  <iframe
                    title={`Spotify player for ${track.title}`}
                    src={track.spotify_embed_url}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="block rounded-xl"
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <div className="panel mt-12 rounded-2xl p-12 text-center">
          <Disc3
            size={40}
            className="mx-auto mb-4 text-slate-600"
            aria-hidden="true"
          />
          <p className="text-slate-400">
            Released tracks are unavailable right now. Please check back later.
          </p>
        </div>
      )}
    </section>
  );
}
