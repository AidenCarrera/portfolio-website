// lib/utils.ts

// Emoji/icon resolver for project stacks
export function getStackIcon(stack: string): string {
  const icons: Record<string, string> = {
    // Programming Languages
    react: "⚛️",
    typescript: "🔷",
    javascript: "🟨",
    python: "🐍",
    cpp: "⚙️",
    java: "☕",
    rust: "🦀",
    ruby: "💎",

    // Frameworks / Tools
    node: "🟢",
    vite: "⚡",
    next: "⏭️",
    tailwind: "🌊",
    supabase: "⚡",
    juce: "🎵",

    // Music / Audio
    music: "🎵",
    piano: "🎹",
    guitar: "🎸",
    drum: "🥁",
    synth: "🎛️",
    vocal: "🎤",
    audio: "🔊",

    // AI / ML / Automation
    ai: "🤖",
    ml: "🤖",
    bot: "🤖",
    neural: "🧠",

    // Databases
    sql: "💾",
    mongodb: "🍃",
    postgres: "🐘",
    redis: "🧩",

    // Other
    docker: "🐳",
    npm: "📦",
    api: "🔗",
    cloud: "☁️",
    game: "🎮",
  };

  const lower = stack.toLowerCase();
  for (const key in icons) {
    if (lower.includes(key)) return icons[key];
  }
  return "🔧"; // default icon
}

// Format a date string into "Mon DD, YYYY"
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Utility: Class name merger (Tailwind helper)
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
