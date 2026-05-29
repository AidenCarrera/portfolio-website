"use client";

import { Disc3 } from "lucide-react";
import { MusicTrack } from "@/types";
import { useState, useEffect } from "react";

interface ReleasedMusicSectionProps {
  tracks?: MusicTrack[];
}

export default function ReleasedMusicSection({
  tracks: initialTracks,
}: ReleasedMusicSectionProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>(initialTracks || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTracks && initialTracks.length > 0) {
      setTracks(initialTracks);
      setLoading(false);
    } else {
      const fetchTracks = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/spotify-tracks");
          if (!res.ok) throw new Error("Failed to fetch released tracks");
          const data = await res.json();
          setTracks(data);
        } catch (err) {
          console.error("Error fetching tracks:", err);
          setError(
            "Unable to load released tracks at the moment. Please try again later."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchTracks();
    }
  }, [initialTracks]);

  return (
    <section className="mb-20">
      <div className="flex items-center space-x-3 mb-8">
        <Disc3 className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Released Music</h2>
      </div>

      {loading && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Disc3
            size={48}
            className="text-slate-600 mx-auto mb-4 animate-spin"
          />
          <p className="text-slate-400">Loading tracks...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-800/30 rounded-xl p-12 text-center border border-red-700">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && tracks.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all"
            >
              <iframe
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
      )}
    </section>
  );
}
