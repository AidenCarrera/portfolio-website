"use client";

import { Music as MusicIcon } from "lucide-react";
import { MusicSnippet } from "@/types";
import AudioPlayer from "@/components/common/AudioPlayer";

interface UpcomingSnippetsSectionProps {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({ snippets }: UpcomingSnippetsSectionProps) {
  return (
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
  );
}
