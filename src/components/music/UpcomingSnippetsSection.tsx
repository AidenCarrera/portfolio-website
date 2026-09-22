"use client";

import { Music } from "lucide-react";
import type { MusicSnippet } from "@/types";
import { useState } from "react";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import CassetteDeck from "./CassetteDeck";
import Cassette from "./Cassette";

interface UpcomingSnippetsSectionProps {
  snippets: MusicSnippet[];
}

export default function UpcomingSnippetsSection({
  snippets,
}: UpcomingSnippetsSectionProps) {
  const [activeSnippet, setActiveSnippet] = useState<MusicSnippet | null>(
    snippets[0] ?? null,
  );

  return (
    <section aria-labelledby="snippets-heading">
      <Reveal>
        <SectionHeading title="Upcoming Snippets" id="snippets-heading" />
      </Reveal>

      {snippets.length > 0 ? (
        <div className="mt-12 space-y-16">
          <Reveal>
            <CassetteDeck activeSnippet={activeSnippet} />
          </Reveal>

          <div>
            <h3 className="eyebrow flex items-center justify-between border-b border-line pb-3 text-muted">
              Tape Collection
              <span className="text-muted">
                {String(snippets.length).padStart(2, "0")}
              </span>
            </h3>
            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
              {snippets.map((snippet, position) => (
                <li key={snippet.id}>
                  <Reveal delay={(position % 5) * 0.05}>
                    <Cassette
                      snippet={snippet}
                      isSelected={activeSnippet?.id === snippet.id}
                      onClick={() => setActiveSnippet(snippet)}
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="panel mt-12 rounded-2xl p-12 text-center">
          <Music
            size={40}
            className="mx-auto mb-4 text-slate-600"
            aria-hidden="true"
          />
          <p className="text-slate-400">
            Tape collection empty. Check back later!
          </p>
        </div>
      )}
    </section>
  );
}
