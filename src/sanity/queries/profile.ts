import { defineQuery } from "next-sanity";

export const profileQuery = defineQuery(`*[_type == "profile"][0] {
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
