import { Disc3 } from "lucide-react";
import type { MusicTrack } from "@/types";

interface ReleasedMusicSectionProps {
  tracks: MusicTrack[];
}

export default function ReleasedMusicSection({
  tracks,
}: ReleasedMusicSectionProps) {
  return (
    <section className="mb-20">
      <div className="flex items-center space-x-3 mb-8">
        <Disc3 className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Released Music</h2>
      </div>

      {tracks.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all"
            >
              <iframe
                title={`Spotify player for ${track.title}`}
                src={track.spotify_embed_url}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg mb-4"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Disc3 size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">
            Released tracks are unavailable right now. Please check back later.
          </p>
        </div>
      )}
    </section>
  );
}
