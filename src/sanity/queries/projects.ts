import { defineQuery } from "next-sanity";

const projectProjection = `{
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
  heroImage {
    alt,
    caption,
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    }
  },
  "gallery": coalesce(gallery[] {
    alt,
    caption,
    asset->{
      _id,
      url,
      metadata {
        dimensions,
        lqip
      }
    }
  }, []),
  "detailContent": coalesce(detailContent, [])
}`;

export const projectsQuery = defineQuery(
  `*[_type == "project"] |
    order(coalesce(displayOrder, 999) asc, githubRepository asc)
    ${projectProjection}`,
);
