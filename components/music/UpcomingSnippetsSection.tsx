"use client";

import AudioPlayer from "@/components/common/AudioPlayer";
import { MusicSnippet } from "@/types";

interface Props {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({ snippets }: Props) {
  return (
    <section className="space-y-6 mb-12">
      <h2 className="text-3xl font-bold text-white mb-4">Upcoming Snippets</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {snippets.map((snippet) => (
          <div key={snippet.id}>
            <AudioPlayer src={snippet.audio_url} title={snippet.title} />
          </div>
        ))}
      </div>
    </section>
  );
}
