import { cache } from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import { profileQuery } from "@/sanity/queries";
import type { SanityProfile } from "@/sanity/types";
import { getSanityErrorMessage } from "@/sanity/lib/errors";

export const getSanityProfile = cache(
  async (): Promise<SanityProfile | null> => {
    try {
      return await sanityFetch<SanityProfile | null>({ query: profileQuery });
    } catch (error) {
      console.error(
        "Unable to load the profile from Sanity; using profile defaults:",
        getSanityErrorMessage(error),
      );
      return null;
    }
  },
);
