import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/client";
import type {
  SanityGearItem,
  SanityMusic,
  SanityProfile,
  SanityProject,
  SanityResumePage,
} from "@/sanity/types";

const imageProjection = `{
  _key,
  alt,
  caption,
  asset->{
    _id,
    url,
    mimeType,
    extension,
    metadata { dimensions, lqip }
  }
}`;

const projectsQuery = defineQuery(`*[_type == "project"] |
  order(coalesce(displayOrder, 999) asc, githubRepository asc) {
    _id,
    githubRepository,
    "hiddenFromProjects": coalesce(hiddenFromProjects, false),
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
  availabilityText
}`);

const resumePageQuery = defineQuery(`*[_type == "resumePage"][0] {
  _id,
  name,
  eyebrow,
  summary,
  "contactLinks": coalesce(contactLinks[] {
    _key,
    label,
    url,
    icon
  }, []),
  resumeFile {
    asset->{
      _id,
      url,
      originalFilename
    }
  },
  education {
    school,
    location,
    degree,
    graduation,
    gpa,
    "coursework": coalesce(coursework, []),
    "honors": coalesce(honors, [])
  },
  "projects": coalesce(projects[] {
    _key,
    name,
    url,
    description,
    "technologies": coalesce(technologies, [])
  }, []),
  "experience": coalesce(experience[] {
    _key,
    role,
    organization,
    location,
    dates,
    "highlights": coalesce(highlights, [])
  }, []),
  "skills": coalesce(skills[] {
    _key,
    name,
    "items": coalesce(items, [])
  }, []),
  seoDescription
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

export function getSanityResumePage(): Promise<SanityResumePage | null> {
  return sanityFetch<SanityResumePage | null>(resumePageQuery, null);
}

export function getSanityGearItems(): Promise<SanityGearItem[]> {
  return sanityFetch<SanityGearItem[]>(gearItemsQuery, []);
}
