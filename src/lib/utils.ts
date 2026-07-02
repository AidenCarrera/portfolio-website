// Utility: Class name merger (Tailwind helper)
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Map tech tags to their proper casing/naming
export function formatTagName(tag: string): string {
  const mapping: Record<string, string> = {
    nextjs: "Next.js",
    tailwindcss: "Tailwind",
    fastapi: "FastAPI",
    typescript: "TypeScript",
    cpp: "C++",
    howlerjs: "Howler.js",
    ollama: "Ollama",
    chromadb: "ChromaDB",
    nodejs: "Node.js",
    socketio: "Socket.IO",
    react: "React",
    python: "Python",
    csharp: "C#",
    aspnet: "ASP.NET",
    mariadb: "MariaDB",
    ai: "AI",
    docker: "Docker",
    game: "Game",
    javascript: "JavaScript",
    mongodb: "MongoDB",
    postgres: "PostgreSQL",
    redis: "Redis",
    juce: "JUCE",
    opengl: "OpenGL",
    html: "HTML",
    css: "CSS",
    pygame: "Pygame",
    vst3: "VST3",
    vst: "VST",
    tonejs: "Tone.js",
    dsp: "DSP",
    fft: "FFT",
    elevenlabs: "ElevenLabs",
    json: "JSON",
    api: "API",
    db: "DB",
    cli: "CLI",
    sdk: "SDK",
    jwt: "JWT",
    ui: "UI",
    ux: "UX",
    sql: "SQL",
    nosql: "NoSQL",
    rest: "REST",
    http: "HTTP",
    github: "GitHub",
    cmake: "CMake",
  };

  const lower = tag.toLowerCase().trim().replace(/-/g, " ");
  if (mapping[lower]) {
    return mapping[lower];
  }

  // Fallback: format each word using the mapping if available, otherwise capitalize
  return tag
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => {
      const lowerWord = word.toLowerCase();
      return mapping[lowerWord] || word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
