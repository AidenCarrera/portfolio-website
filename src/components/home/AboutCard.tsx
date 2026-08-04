import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AboutCardProps {
  aboutMe: string;
}

export default function AboutCard({ aboutMe }: AboutCardProps) {
  const paragraphs = aboutMe
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-brand/50 transition-all flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
      <div className="text-slate-300 space-y-4 leading-relaxed text-base">
        {paragraphs.map((paragraph, index) => (
          <p key={paragraph}>
            {paragraph}
            {index === paragraphs.length - 1 && (
              <span className="block mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded text-brand transition-colors hover:text-brand-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  Read full about
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </span>
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
