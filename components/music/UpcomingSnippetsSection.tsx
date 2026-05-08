"use client";

import { Music } from "lucide-react";
import { MusicSnippet } from "@/types";
import { useState } from "react";
import CassetteDeck from "./CassetteDeck";
import Cassette from "./Cassette";

interface Props {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({ snippets }: Props) {
  const [activeSnippet, setActiveSnippet] = useState<MusicSnippet | null>(
    snippets[0] ?? null
  );

  return (
    <section className="mb-24">
      <div className="flex items-center space-x-3 mb-12">
        <Music className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Upcoming Snippets</h2>
      </div>

      {snippets.length > 0 ? (
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
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Music size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Tape collection empty. Check back later!</p>
        </div>
      )}
    </section>
  );
}
