import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityEnabled, projectId } from "@/sanity/env";

const client = isSanityEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      perspective: "published",
      useCdn: process.env.NODE_ENV === "production",
    })
  : null;

const REVALIDATE_SECONDS = process.env.NODE_ENV === "development" ? 0 : 3600;

if (!client && process.env.NODE_ENV === "development") {
  console.warn(
    "Sanity is not configured; the site is running on its in-repo defaults.",
  );
}

// Every failure resolves to the caller's fallback so missing or unreachable
// CMS content degrades the page instead of breaking it.
export async function sanityFetch<Result>(
  query: string,
  fallback: Result,
  params: QueryParams = {},
): Promise<Result> {
  if (!client) {
    return fallback;
  }

  try {
    return await client.fetch<Result>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch (error) {
    console.error("Sanity request failed; using fallback content:", error);
    return fallback;
  }
}
