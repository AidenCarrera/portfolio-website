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
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
