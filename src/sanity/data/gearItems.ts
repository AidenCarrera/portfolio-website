import { sanityFetch } from "@/sanity/lib/fetch";
import { gearItemsQuery } from "@/sanity/queries";
import type { SanityGearItem } from "@/sanity/types";
import { getSanityErrorMessage } from "@/sanity/lib/errors";

export async function getSanityGearItems(): Promise<SanityGearItem[]> {
  try {
    return await sanityFetch<SanityGearItem[]>({
      query: gearItemsQuery,
    });
  } catch (error) {
    console.error(
      "Unable to load gear items from Sanity; gear is unavailable:",
      getSanityErrorMessage(error),
    );
    return [];
  }
}
