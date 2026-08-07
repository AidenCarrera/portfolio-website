import { cache } from "react";
import { getSanityProfile } from "@/sanity/content";
import type { SanityImage, SkillCategoryIcon } from "@/sanity/types";

export interface SkillCategory {
  /** Sanity's array key, or a stable stand-in for the built-in defaults. */
  key: string;
  name: string;
  icon: SkillCategoryIcon;
  items: string[];
}

export interface WebsiteProfile {
  name: string;
  // Absent until the Sanity Landing document or CONTACT_EMAIL supplies one.
  email?: string;
  aboutMe: string;
  landingText: string;
  sloganText: string;
  availabilityText: string;
  // Absent until a portrait is uploaded; the page falls back to a monogram.
  portrait?: SanityImage;
  skills: {
    intro: string;
    categories: SkillCategory[];
  };
  musicIntro: string;
  featured: {
    intro: string;
    /** Pinned repositories as "owner/name", in the order they should appear. */
    repositories: string[];
    count: number;
  };
}

export const DEFAULT_PROFILE: WebsiteProfile = {
  name: "Aiden Carrera",
  email: process.env.CONTACT_EMAIL?.trim() || undefined,
  aboutMe: `Hey, I’m Aiden. I’m an honors computer science student at Oklahoma State University with a 3.9 GPA, graduating in December 2026. I build full-stack web apps, C++ audio software, AI models, and interactive tools.

I’m a performer, composer, and producer. I perform with the OSU Jazz Band and Resistance Indoor Percussion and toured nationally with The Cavaliers Drum & Bugle Corps in 2024. I also write, record, mix, and master my own music.`,
  landingText: "Software Developer.\nMusician. Creator.",
  sloganText:
    "CS Honors Student at OSU building full-stack applications, audio software, and AI.",
  availabilityText: "Based in Tulsa, OK · Open to Relocation & Remote Roles",
  skills: {
    intro: "Technologies, frameworks, and tools I use to build.",
    categories: [
      {
        key: "languages",
        name: "Languages",
        icon: "code",
        items: [
          "TypeScript",
          "JavaScript",
          "Java",
          "Python",
          "C++",
          "HTML",
          "CSS",
        ],
      },
      {
        key: "web",
        name: "Web Development",
        icon: "layers",
        items: [
          "React",
          "Next.js",
          "Node.js",
          "Express",
          "FastAPI",
          "ASP.NET Core",
          "Tailwind CSS",
          "Socket.IO",
        ],
      },
      {
        key: "ai-audio-graphics",
        name: "AI, Audio & Graphics",
        icon: "terminal",
        items: ["PyTorch", "JUCE", "OpenGL", "WebGL", "Three.js", "Tone.js"],
      },
      {
        key: "data-content",
        name: "Data & Content",
        icon: "database",
        items: ["MariaDB", "Redis", "ChromaDB", "Sanity"],
      },
      {
        key: "tools",
        name: "Tools & Environment",
        icon: "tools",
        items: [
          "Git",
          "Docker",
          "CMake",
          "GitHub Actions",
          "Jupyter",
          "Vite",
          "pnpm",
        ],
      },
    ],
  },
  musicIntro:
    "I write, record, and produce original music. Explore my featured tracks, custom tape player, and the gear behind my sound.",
  featured: {
    intro:
      "Featured projects showcasing full-stack development, AI tools, and interactive software. Click any project for more information, screenshots, and repo links.",
    repositories: [
      "AidenCarrera/stillwater-pulse",
      "AidenCarrera/random-webs",
      "SeanS-git/SeniorCapstone",
      "AidenCarrera/olo-eq",
    ],
    count: 4,
  },
};

/** Trims a CMS string, falling back when the field is absent or blank. */
function text(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

export const getWebsiteProfile = cache(async (): Promise<WebsiteProfile> => {
  const profile = await getSanityProfile();

  if (!profile) {
    return DEFAULT_PROFILE;
  }

  return {
    name: profile.name || DEFAULT_PROFILE.name,
    email: profile.email?.trim() || DEFAULT_PROFILE.email,
    aboutMe: profile.aboutMe || DEFAULT_PROFILE.aboutMe,
    landingText: profile.landingText || DEFAULT_PROFILE.landingText,
    sloganText: profile.sloganText || DEFAULT_PROFILE.sloganText,
    availabilityText: text(
      profile.availabilityText,
      DEFAULT_PROFILE.availabilityText,
    ),
    portrait: profile.portrait,
    skills: {
      intro: text(profile.skillsIntro, DEFAULT_PROFILE.skills.intro),
      // An empty array means the document has no categories yet, so the
      // built-in set stands in rather than leaving the section headless.
      categories:
        profile.skills.length > 0
          ? profile.skills.map((category) => ({
              key: category._key,
              name: category.name,
              icon: category.icon ?? "code",
              items: category.items,
            }))
          : DEFAULT_PROFILE.skills.categories,
    },
    musicIntro: text(profile.musicIntro, DEFAULT_PROFILE.musicIntro),
    featured: {
      intro: text(profile.projectsIntro, DEFAULT_PROFILE.featured.intro),
      // Dangling references drop out rather than taking up a pinned slot.
      repositories: profile.featuredProjects
        .map((repository) => repository?.trim())
        .filter((repository): repository is string => Boolean(repository)),
      count: profile.featuredProjectCount ?? DEFAULT_PROFILE.featured.count,
    },
  };
});
