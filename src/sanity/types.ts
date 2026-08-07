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

export type SkillCategoryIcon =
  | "code"
  | "layers"
  | "audio"
  | "terminal"
  | "database"
  | "chip"
  | "palette"
  | "tools";

export interface SanitySkillCategory {
  _key: string;
  name: string;
  icon?: SkillCategoryIcon;
  items: string[];
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
  skillsIntro?: string;
  skills: SanitySkillCategory[];
  projectsIntro?: string;
  /**
   * Pinned references projected down to `githubRepository`, how projects are
   * keyed outside Sanity. References left dangling by a delete deref to null.
   */
  featuredProjects: (string | null)[];
  featuredProjectCount?: number;
  musicIntro?: string;
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
