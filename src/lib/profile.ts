import { cache } from "react";
import { getSanityProfile } from "@/sanity/content";
import { cmsText } from "@/lib/utils";
import type {
  SanityAboutPage,
  SanityImage,
  SanityResumeEducation,
  SanityResumePage,
  SkillCategoryIcon,
} from "@/sanity/types";

/**
 * Sanity is the source of truth for site content; the FALLBACK_* values below
 * are generic, public-safe copy for when the CMS is unreachable or a document
 * is empty. Personal content (contact details, education, employment, project
 * write-ups, biography) belongs in the CMS only — sections with no fallback
 * hide themselves rather than render an empty shell.
 */

export interface SkillCategory {
  /** Sanity's `_key` for this array item. */
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
    /** Empty hides the Skills section instead of rendering a bare heading. */
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

/** About page content as rendered, without Sanity's document id. */
export type AboutPageContent = Omit<SanityAboutPage, "_id">;

/** Resume page content as rendered, without Sanity's document id. */
export interface ResumePageContent extends Omit<
  SanityResumePage,
  "_id" | "resumeFile" | "education"
> {
  /** Absent without a CMS document; the Education section hides. */
  education?: SanityResumeEducation;
  /** Absent until a PDF is uploaded; the download button hides. */
  downloadUrl?: string;
}

/** Schema.org job title for the Person entity in structured data. */
export const JOB_TITLE =
  "Software Engineer, Audio Programmer, and Music Producer";

/** Root layout keywords; the name and portfolio title are prepended there. */
export const SEO_KEYWORDS = [
  "portfolio",
  "Software Engineer Portfolio",
  "Audio Developer Portfolio",
  "Music Portfolio",
  "Software Engineer",
  "Music Producer",
  "Audio Programmer",
  "JUCE C++",
  "React Developer",
  "Web Audio API",
];

export const FALLBACK_PROFILE: WebsiteProfile = {
  name: "Aiden Carrera",
  email: process.env.CONTACT_EMAIL?.trim() || undefined,
  aboutMe:
    "Software developer and musician building web applications, audio software, AI projects, and interactive experiences.",
  landingText: "Software Developer.\nMusician. Creator.",
  sloganText:
    "Software developer building full-stack applications, audio software, and AI.",
  availabilityText: "Open to new opportunities",
  skills: {
    intro: "The technologies, frameworks, and tools I use to build.",
    // Categories live in the Landing document; empty hides the section.
    categories: [],
  },
  musicIntro:
    "I write, record, and produce original music. Explore my featured tracks, custom tape player, and the gear behind my sound.",
  featured: {
    intro:
      "Featured projects showcasing full-stack development, AI tools, and interactive software. Click any project for more information, screenshots, and repo links.",
    // Pins curate the GitHub feed; without them it keeps its own order.
    repositories: [],
    count: 4,
  },
};

export const FALLBACK_ABOUT_PAGE: AboutPageContent = {
  eyebrow: "Software Developer & Musician",
  heading: "About Me",
  intro:
    "Software developer and musician building web applications, audio software, AI tools, and interactive experiences.",
  galleryHeading: "Gallery",
  // Gallery imagery is CMS-hosted, so the section drops out entirely.
  gallery: [],
};

export const FALLBACK_RESUME_PAGE: ResumePageContent = {
  name: FALLBACK_PROFILE.name,
  eyebrow: "Software Developer",
  summary:
    "Software developer building web applications, audio software, AI projects, and interactive experiences.",
  // CMS-only content; each section hides while its list is empty.
  contactLinks: [],
  projects: [],
  experience: [],
  skills: [],
};

export const getWebsiteProfile = cache(async (): Promise<WebsiteProfile> => {
  try {
    const profile = await getSanityProfile();

    if (!profile) {
      return FALLBACK_PROFILE;
    }

    return {
      name: cmsText(profile.name, FALLBACK_PROFILE.name),
      email: profile.email?.trim() || FALLBACK_PROFILE.email,
      aboutMe: cmsText(profile.aboutMe, FALLBACK_PROFILE.aboutMe),
      landingText: cmsText(profile.landingText, FALLBACK_PROFILE.landingText),
      sloganText: cmsText(profile.sloganText, FALLBACK_PROFILE.sloganText),
      availabilityText: cmsText(
        profile.availabilityText,
        FALLBACK_PROFILE.availabilityText,
      ),
      portrait: profile.portrait,
      skills: {
        intro: cmsText(profile.skillsIntro, FALLBACK_PROFILE.skills.intro),
        categories: profile.skills.map((category) => ({
          key: category._key,
          name: category.name,
          icon: category.icon ?? "code",
          items: category.items,
        })),
      },
      musicIntro: cmsText(profile.musicIntro, FALLBACK_PROFILE.musicIntro),
      featured: {
        intro: cmsText(profile.projectsIntro, FALLBACK_PROFILE.featured.intro),
        // Dangling references drop out rather than taking up a pinned slot.
        repositories: profile.featuredProjects
          .map((repository) => repository?.trim())
          .filter((repository): repository is string => Boolean(repository)),
        count: profile.featuredProjectCount ?? FALLBACK_PROFILE.featured.count,
      },
    };
  } catch (error) {
    // sanityFetch swallows request failures, so reaching here means the
    // document came back in a shape the mapping above could not read.
    console.error("Profile content unavailable; using fallback:", error);
    return FALLBACK_PROFILE;
  }
});
