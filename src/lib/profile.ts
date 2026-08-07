import { cache } from "react";
import { getSanityProfile } from "@/sanity/content";
import type { SanityImage } from "@/sanity/types";

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
  aboutHeading: string;
  musicHeading: string;
  musicIntro: string;
  contactHeading: string;
  featured: {
    heading: string;
    intro: string;
    /** Pinned repositories as "owner/name", in the order they should appear. */
    repositories: string[];
    count: number;
  };
}

export const DEFAULT_PROFILE: WebsiteProfile = {
  name: "Aiden Carrera",
  email: process.env.CONTACT_EMAIL?.trim() || undefined,
  aboutMe: `Hey, I'm Aiden. I'm a Computer Science student in the OSU Honors College building software across audio, artificial intelligence, web applications, and games.

I work primarily with C++, TypeScript, Python, Java, JUCE, React, Next.js, and OpenGL, focusing on audio programming, graphics, and AI. My projects' source code is available on GitHub.

I'm also a performer, composer, and producer. I perform with the OSU Jazz Band, Resistance Indoor Percussion, and other ensembles, and I write, record, mix, and master my own music.`,
  landingText: "Musician. Producer.\nDeveloper.",
  sloganText: "I build creative software and make original music.",
  availabilityText:
    "Based in Tulsa, Oklahoma · Open to full-time opportunities in Oklahoma and remote",
  aboutHeading: "About Me",
  musicHeading: "I also make music",
  musicIntro:
    "I write, record, and produce original music. Explore my featured tracks, custom tape player, and the gear behind my sound.",
  contactHeading: "Let’s Connect",
  featured: {
    heading: "Featured Projects",
    intro:
      "Featured projects showcasing full-stack development, AI tools, and interactive software. Click any project for more information, screenshots, and repo links.",
    repositories: [],
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
    aboutHeading: text(profile.aboutHeading, DEFAULT_PROFILE.aboutHeading),
    musicHeading: text(profile.musicHeading, DEFAULT_PROFILE.musicHeading),
    musicIntro: text(profile.musicIntro, DEFAULT_PROFILE.musicIntro),
    contactHeading: text(
      profile.contactHeading,
      DEFAULT_PROFILE.contactHeading,
    ),
    featured: {
      heading: text(profile.projectsHeading, DEFAULT_PROFILE.featured.heading),
      intro: text(profile.projectsIntro, DEFAULT_PROFILE.featured.intro),
      // Dangling references drop out rather than taking up a pinned slot.
      repositories: profile.featuredProjects
        .map((repository) => repository?.trim())
        .filter((repository): repository is string => Boolean(repository)),
      count: profile.featuredProjectCount ?? DEFAULT_PROFILE.featured.count,
    },
  };
});
