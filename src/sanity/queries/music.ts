import { defineQuery } from "next-sanity";

export const musicQuery = defineQuery(`*[_type == "music"] |
  order(_createdAt asc) {
    _id,
    name,
    audio {
      asset->{
        _id,
        url,
        originalFilename,
        mimeType
      }
    }
  }`);
