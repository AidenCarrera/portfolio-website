import type { QueryParams } from "next-sanity";
import { sanityClient } from "@/sanity/lib/client";

export const DEFAULT_SANITY_REVALIDATE =
  process.env.NODE_ENV === "development" ? 0 : 3600;

interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
}

export function sanityFetch<Result>({
  query,
  params = {},
  revalidate = DEFAULT_SANITY_REVALIDATE,
}: SanityFetchOptions): Promise<Result> {
  if (process.env.SANITY_DISABLED === "true") {
    return Promise.reject(
      new Error("Sanity requests are disabled by SANITY_DISABLED."),
    );
  }

  return sanityClient.fetch<Result>(query, params, {
    next: { revalidate },
  });
}
