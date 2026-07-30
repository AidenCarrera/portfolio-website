import type { PortableTextBlock } from "sanity";

export interface SanityImage {
  alt: string;
  caption?: string;
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
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
