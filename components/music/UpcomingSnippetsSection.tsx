"use client";

import { Music } from "lucide-react";
import AudioPlayer from "@/components/common/AudioPlayer";
import { MusicSnippet } from "@/types";
import { useState, useEffect } from "react";

interface Props {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({ snippets: initialSnippets }: Props) {
  const [snippets, setSnippets] = useState<MusicSnippet[]>(initialSnippets || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialSnippets || initialSnippets.length === 0) {
      const fetchSnippets = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("/api/snippets");
          if (!res.ok) throw new Error("Failed to fetch upcoming snippets");
          const data = await res.json();
          setSnippets(data);
        } catch (err) {
          console.error("Error fetching snippets:", err);
          setError("Unable to load upcoming snippets right now. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchSnippets();
    }
  }, [initialSnippets]);

  return (
    <section className="mb-20">
      <div className="flex items-center space-x-3 mb-8">
        <Music className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Upcoming Snippets</h2>
      </div>

      {loading && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Music size={48} className="text-slate-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Loading snippets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-800/30 rounded-xl p-12 text-center border border-red-700">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && snippets.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-brand/50 transition-all"
            >
              <AudioPlayer src={snippet.audio_url} title={snippet.title} />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && snippets.length === 0 && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Music size={48} className="text-slate-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">New snippets coming soon. Check back later!</p>
        </div>
      )}
    </section>
  );
}
