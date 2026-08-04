import { cache } from "react";
import { getSanityAboutPage } from "@/sanity/content";
import type { SanityAboutPage } from "@/sanity/types";

/** Splits a blank-line separated text field into paragraphs. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Every word on the About page comes from the CMS, so there is nothing to fall
 * back to: no document means the route has no content and the page 404s.
 */
export const getAboutPage = cache((): Promise<SanityAboutPage | null> =>
  getSanityAboutPage(),
);
