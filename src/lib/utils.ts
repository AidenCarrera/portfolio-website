import type { SanityImage } from "@/sanity/types";

/** Trims a CMS string, falling back when the field is absent or blank. */
export function cmsText(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

/**
 * GitHub stores a repository's homepage as typed, which is sometimes without
 * a scheme. Lives here rather than in `projects.ts` so client components can
 * use it without bundling the GitHub and Sanity fetchers.
 */
export function getLiveUrl(homepageUrl: string | null): string | null {
  const homepage = homepageUrl?.trim();
  if (!homepage) {
    return null;
  }
  return homepage.startsWith("http") ? homepage : `https://${homepage}`;
}

// Preserve GIF animation by bypassing image optimization.
export function isAnimatedImage(image: SanityImage | undefined): boolean {
  const asset = image?.asset;
  return (
    asset?.mimeType === "image/gif" || asset?.extension?.toLowerCase() === "gif"
  );
}

// Collapses topic spellings so filtering and display agree on one form.
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().replace(/-/g, " ");
}

// Canonical spellings for tags whose display form is not just title case.
const TAG_NAMES: Record<string, string> = {
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

export function formatTagName(tag: string): string {
  const lower = normalizeTag(tag);
  if (TAG_NAMES[lower]) {
    return TAG_NAMES[lower];
  }

  return tag
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => {
      const lowerWord = word.toLowerCase();
      return (
        TAG_NAMES[lowerWord] || word.charAt(0).toUpperCase() + word.slice(1)
      );
    })
    .join(" ");
}
