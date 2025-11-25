"use client";

import { Music } from "lucide-react";
import { MusicSnippet } from "@/types";
import { useState, useEffect } from "react";
import CassetteDeck from "./CassetteDeck";
import Cassette from "./Cassette";

interface Props {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({ snippets: initialSnippets }: Props) {
  const [snippets, setSnippets] = useState<MusicSnippet[]>(initialSnippets || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<MusicSnippet | null>(null);

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
          // Auto-load the first snippet if available
          if (data.length > 0) setActiveSnippet(data[0]);
        } catch (err) {
          console.error("Error fetching snippets:", err);
          setError("Unable to load upcoming snippets right now. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      fetchSnippets();
    } else if (initialSnippets.length > 0 && !activeSnippet) {
      setActiveSnippet(initialSnippets[0]);
    }
  }, [initialSnippets]);

  return (
    <section className="mb-24">
      <div className="flex items-center space-x-3 mb-12">
        <Music className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Upcoming Snippets</h2>
      </div>

      {loading && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Music size={48} className="text-slate-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Loading tape collection...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-800/30 rounded-xl p-12 text-center border border-red-700">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && snippets.length > 0 && (
        <div className="space-y-12">
          {/* The Deck */}
          <CassetteDeck activeSnippet={activeSnippet} />

          {/* The Shelf */}
          <div>
            <h3 className="text-slate-400 text-sm font-mono uppercase tracking-widest mb-6 border-b border-slate-800 pb-2">
              Tape Collection
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {snippets.map((snippet) => (
                <Cassette
                  key={snippet.id}
                  snippet={snippet}
                  isSelected={activeSnippet?.id === snippet.id}
                  onClick={() => setActiveSnippet(snippet)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && !error && snippets.length === 0 && (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Music size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Tape collection empty. Check back later!</p>
        </div>
      )}
    </section>
  );
}
