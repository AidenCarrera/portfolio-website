import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/client";
import type {
  SanityGearItem,
  SanityMusic,
  SanityProfile,
  SanityProject,
} from "@/sanity/types";

const imageProjection = `{
  alt,
  caption,
  asset->{
    _id,
    url,
    metadata { dimensions }
  }
}`;

const projectsQuery = defineQuery(`*[_type == "project"] |
  order(coalesce(displayOrder, 999) asc, githubRepository asc) {
    _id,
    githubRepository,
    displayOrder,
    repoNameOverwrite,
    cardDescription,
    tagsOverwrite,
    role,
    timeframe,
    status,
    "highlights": coalesce(highlights, []),
    heroImage ${imageProjection},
    "gallery": coalesce(gallery[] ${imageProjection}, []),
    "detailContent": coalesce(detailContent, [])
  }`);

const musicQuery = defineQuery(`*[_type == "music"] |
  order(_createdAt asc) {
    _id,
    name,
    audio {
      asset->{
        _id,
        url
      }
    }
  }`);

const profileQuery = defineQuery(`*[_type == "profile"][0] {
  _id,
  name,
  email,
  aboutMe,
  landingText,
  sloganText,
  resume {
    asset->{
      _id,
      url,
      originalFilename
    }
  }
}`);

const gearItemsQuery = defineQuery(`*[_type == "gearItem"] |
  order(coalesce(sortOrder, 999) asc, name asc) {
    _id,
    name,
    type,
    category,
    "featured": coalesce(featured, false),
    image ${imageProjection}
  }`);

export function getSanityProjects(): Promise<SanityProject[]> {
  return sanityFetch<SanityProject[]>(projectsQuery, []);
}

export function getSanityMusic(): Promise<SanityMusic[]> {
  return sanityFetch<SanityMusic[]>(musicQuery, []);
}

export function getSanityProfile(): Promise<SanityProfile | null> {
  return sanityFetch<SanityProfile | null>(profileQuery, null);
}

export function getSanityGearItems(): Promise<SanityGearItem[]> {
  return sanityFetch<SanityGearItem[]>(gearItemsQuery, []);
}
