"use client";

import { Music as MusicIcon, Disc3, Wrench } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MusicTrack, MusicSnippet, GearItem } from "@/types";
import Image from "next/image";

export default function Music() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [snippets, setSnippets] = useState<MusicSnippet[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    (async () => {
      // Fetch Spotify tracks
      const res = await fetch("/api/spotify-tracks");
      const spotifyTracks = await res.json();
      setTracks(spotifyTracks);

      // Fetch snippets & gear from Supabase
      const [snippetsResult, gearResult] = await Promise.all([
        supabase.from("music_snippets").select("*").order("created_at", { ascending: false }),
        supabase.from("gear_items").select("*").order("name"),
      ]);
      if (snippetsResult.data) setSnippets(snippetsResult.data);
      if (gearResult.data) setGear(gearResult.data);
    })();
  }, []);

  const categories = ["all", ...new Set(gear.map((g) => g.category))];
  const filteredGear =
    selectedCategory === "all" ? gear : gear.filter((g) => g.category === selectedCategory);

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

        {/* Released Tracks */}
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
              <MusicIcon size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Released tracks coming soon. Stay tuned!</p>
            </div>
          )}
        </section>

        {/* Upcoming Snippets */}
        <section className="mb-20">
          <div className="flex items-center space-x-3 mb-8">
            <MusicIcon className="text-brand" size={28} />
            <h2 className="text-3xl font-bold text-white">Upcoming Snippets</h2>
          </div>
          <p className="text-slate-400 mb-6">
            Short previews of works in progress. These snippets showcase the creative process.
          </p>
          {snippets.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {snippets.map((snippet) => (
                <AudioPlayer
                  key={snippet.id}
                  title={snippet.title}
                  audioUrl={snippet.audio_url}
                  caption={snippet.caption}
                  gearUsed={snippet.gear_used}
                  status={snippet.status}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
              <MusicIcon size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">New snippets coming soon. Check back later!</p>
            </div>
          )}
        </section>

        {/* Gear */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <Wrench className="text-brand" size={28} />
            <h2 className="text-3xl font-bold text-white">Gear & Software</h2>
          </div>

          {gear.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-amber-500 text-slate-900"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}

          {filteredGear.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGear.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all group"
                >
                  {item.image_url ? (
                    <div className="w-full h-40 relative mb-4">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                      <Wrench size={48} className="text-slate-500" />
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand transition-colors">
                    {item.name}
                  </h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300 mb-2">
                    {item.category}
                  </span>
                  {item.description && (
                    <p className="text-slate-400 text-sm">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
              <Wrench size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Gear showcase coming soon.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
