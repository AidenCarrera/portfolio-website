import { sanityFetch } from "@/sanity/lib/fetch";
import { musicQuery } from "@/sanity/queries";
import type { SanityMusic } from "@/sanity/types";
import { getSanityErrorMessage } from "@/sanity/lib/errors";

export async function getSanityMusic(): Promise<SanityMusic[]> {
  try {
    return await sanityFetch<SanityMusic[]>({ query: musicQuery });
  } catch (error) {
    console.error(
      "Unable to load music from Sanity; audio snippets are unavailable:",
      getSanityErrorMessage(error),
    );
    return [];
  }
}
