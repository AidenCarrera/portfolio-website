export default function AboutCard() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-brand/50 transition-all flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
        <div className="text-slate-300 space-y-4 leading-relaxed text-base">
          <p>
            Hey, I&apos;m Aiden. I&apos;m a Computer Science student in the OSU Honors College building software across audio, artificial intelligence, web applications, and games.
          </p>
          <p>
            I work primarily with C++, TypeScript, Python, Java, JUCE, React, Next.js, and OpenGL, focusing on audio programming, graphics, and AI. Most of my projects are open source and available to explore.
          </p>
          <p>
            I&apos;m also a performer, composer, and producer. I perform with the OSU Jazz Band, Resistance Indoor Percussion, and other ensembles, and I write, record, mix, and master my own music.
          </p>
        </div>
      </div>
    </div>
  );
}
