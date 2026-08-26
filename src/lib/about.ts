import { cache } from "react";
import { getSanityAboutPage } from "@/sanity/content";
import { FALLBACK_ABOUT_PAGE, type AboutPageContent } from "@/lib/profile";
import { cmsText } from "@/lib/utils";

/** Splits a blank-line separated text field into paragraphs. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export const getAboutPage = cache(async (): Promise<AboutPageContent> => {
  try {
    const about = await getSanityAboutPage();

    if (!about) {
      return FALLBACK_ABOUT_PAGE;
    }

    return {
      eyebrow: cmsText(about.eyebrow, FALLBACK_ABOUT_PAGE.eyebrow),
      heading: cmsText(about.heading, FALLBACK_ABOUT_PAGE.heading),
      intro: cmsText(about.intro, FALLBACK_ABOUT_PAGE.intro),
      portrait: about.portrait,
      locationLabel: about.locationLabel?.trim() || undefined,
      graduationLabel: about.graduationLabel?.trim() || undefined,
      availabilityLabel: about.availabilityLabel?.trim() || undefined,
      galleryHeading: cmsText(
        about.galleryHeading,
        FALLBACK_ABOUT_PAGE.galleryHeading ?? "",
      ),
      galleryIntro: about.galleryIntro,
      gallery: about.gallery,
      seoDescription: about.seoDescription,
    };
  } catch (error) {
    console.error("About content unavailable; using fallback:", error);
    return FALLBACK_ABOUT_PAGE;
  }
});
