import type { PortableTextBlock } from "sanity";

export interface SanityImage {
  /** Present only on images inside an array; the stable React key for them. */
  _key?: string;
  alt: string;
  caption?: string;
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
  resume?: {
    asset: {
      _id: string;
      url: string;
      originalFilename?: string;
    };
  };
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
