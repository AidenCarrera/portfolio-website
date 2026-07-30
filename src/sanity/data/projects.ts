import { projectsQuery } from "@/sanity/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import type { SanityProject } from "@/sanity/types";
import { getSanityErrorMessage } from "@/sanity/lib/errors";

export async function getSanityProjects(): Promise<SanityProject[]> {
  try {
    return await sanityFetch<SanityProject[]>({
      query: projectsQuery,
    });
  } catch (error) {
    console.error(
      "Unable to load Sanity projects; using GitHub data only:",
      getSanityErrorMessage(error),
    );
    return [];
  }
}
