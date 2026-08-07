import type { PortableTextBlock } from "sanity";

export interface SanityImage {
  /** Present only on images inside an array; the stable React key for them. */
  _key?: string;
  alt: string;
  caption?: string;
  displayOrder?: number;
  asset: {
    _id: string;
    url: string;
    /** e.g. "image/gif"; used to keep animated formats away from the optimizer. */
    mimeType?: string;
    /** Lowercase file extension, e.g. "gif". Backstop when mimeType is absent. */
    extension?: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
      /** Base64 data URI Sanity generates per asset; used as a blur placeholder. */
      lqip?: string;
    };
  };
}

export interface SanityProject {
  _id: string;
  githubRepository: string;
  hiddenFromProjects: boolean;
  displayOrder?: number;
  repoNameOverwrite?: string;
  cardDescription?: string;
  tagsOverwrite?: string[];
  role?: string;
  timeframe?: string;
  status?: "Active" | "Complete" | "Archived";
  highlights: string[];
  heroImage?: SanityImage;
  gallery: SanityImage[];
  detailContent: PortableTextBlock[];
}

export interface SanityMusic {
  _id: string;
  name: string;
  audio: {
    asset: {
      _id: string;
      url: string;
    };
  };
}

export interface SanityProfile {
  _id: string;
  name: string;
  email: string;
  aboutMe: string;
  landingText: string;
  sloganText: string;
  availabilityText?: string;
  portrait?: SanityImage;
  aboutHeading?: string;
  projectsHeading?: string;
  projectsIntro?: string;
  /**
   * The pinned references projected down to their `githubRepository` identity,
   * which is what a project is keyed by everywhere outside Sanity. A reference
   * left dangling by a deleted project derefs to null.
   */
  featuredProjects: (string | null)[];
  featuredProjectCount?: number;
  musicHeading?: string;
  musicIntro?: string;
  contactHeading?: string;
}

export interface SanityAboutSkillCategory {
  _key: string;
  name: string;
  items: string[];
}

export interface SanityAboutPage {
  _id: string;
  eyebrow: string;
  heading: string;
  /** Paragraphs separated by blank lines. */
  intro: string;
  portrait?: SanityImage;
  locationLabel?: string;
  graduationLabel?: string;
  availabilityLabel?: string;
  skillsHeading?: string;
  skills: SanityAboutSkillCategory[];
  galleryHeading?: string;
  galleryIntro?: string;
  gallery: SanityImage[];
  seoDescription?: string;
}

export type ResumeContactIcon =
  "github" | "linkedin" | "email" | "website" | "link";

export interface SanityResumeContactLink {
  _key: string;
  label: string;
  url: string;
  icon: ResumeContactIcon;
}

export interface SanityResumeEducation {
  school: string;
  location: string;
  degree: string;
  graduation: string;
  gpa: string;
  coursework: string[];
  honors: string[];
}

export interface SanityResumeProject {
  _key: string;
  name: string;
  url: string;
  description: string;
  technologies: string[];
}

export interface SanityResumeExperience {
  _key: string;
  role: string;
  organization: string;
  location?: string;
  dates: string;
  highlights: string[];
}

export interface SanityResumeSkillCategory {
  _key: string;
  name: string;
  items: string[];
}

export interface SanityResumePage {
  _id: string;
  name: string;
  eyebrow: string;
  summary: string;
  contactLinks: SanityResumeContactLink[];
  resumeFile?: {
    asset: {
      _id: string;
      url: string;
      originalFilename?: string;
    };
  };
  education: SanityResumeEducation;
  projects: SanityResumeProject[];
  experience: SanityResumeExperience[];
  skills: SanityResumeSkillCategory[];
  seoDescription?: string;
}

export type GearItemType =
  "instrument" | "hardware" | "software" | "instrumentPlugin" | "mixingPlugin";

export interface SanityGearItem {
  _id: string;
  name: string;
  type: GearItemType;
  category?: string;
  featured: boolean;
  image?: SanityImage;
}
