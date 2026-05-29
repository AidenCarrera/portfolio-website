export default function AboutCard() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-brand/50 transition-all">
      <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
      <div className="text-slate-300 space-y-3 leading-relaxed">
        <p>
          Prospective OSU Honors College graduate in Computer Science with
          interests in software engineering, audio programming, and music
          technologies.
        </p>
        <p>
          Experienced with C++, Java, Python, TypeScript, JUCE, and web
          development. I build interactive projects, including piano apps
          and C++ audio plugins.
        </p>
        <p>
          Outside of coding, I&apos;m an active musician who performs in
          the OSU Jazz Band, Resistance Indoor Percussion, and other
          ensembles. I compose, produce, and release original music.
        </p>
      </div>
    </div>
  );
}
