"use client";

import AudioPlayer from "@/components/common/AudioPlayer";
import { MusicSnippet } from "@/types";
import { Music } from "lucide-react";

interface Props {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({ snippets }: Props) {
  return (
    <section className="space-y-6 mb-12">
      <div className="flex items-center space-x-3 mb-4">
        <Music className="text-brand" size={28} />
        <h2 className="text-3xl font-bold text-white">Upcoming Snippets</h2>
      </div>

      {snippets.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {snippets.map((snippet) => (
            <div key={snippet.id}>
              <AudioPlayer src={snippet.audio_url} title={snippet.title} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/30 rounded-xl p-12 text-center border border-slate-700">
          <Music size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">New snippets coming soon. Check back later!</p>
        </div>
      )}
    </section>
  );
}
