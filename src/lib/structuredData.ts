import { socialLinks } from "@/lib/socialLinks";
import { SITE_URL } from "@/lib/siteUrl";
import { splitParagraphs } from "@/lib/about";
import type { WebsiteProfile } from "@/lib/profile";
import type { SanityAboutPage } from "@/sanity/types";

const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

export function getGlobalStructuredData(profile: WebsiteProfile) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        ...(profile.email ? { email: profile.email } : {}),
        url: SITE_URL,
        image: `${SITE_URL}/developer-logo.svg`,
        jobTitle: "Software Engineer, Audio Programmer, and Music Producer",
        description: profile.aboutMe,
        sameAs: socialLinks.map((link) => link.url),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: `${profile.name} Portfolio`,
        description: profile.sloganText,
        inLanguage: "en-US",
        creator: {
          "@id": personId,
        },
      },
    ],
  };
}

export function getAboutPageStructuredData(
  about: SanityAboutPage,
  profile: WebsiteProfile,
) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#about-page`,
    url: `${SITE_URL}/about`,
    name: `About | ${profile.name}`,
    description:
      about.seoDescription?.trim() || splitParagraphs(about.intro)[0],
    inLanguage: "en-US",
    isPartOf: {
      "@id": websiteId,
    },
    mainEntity: {
      "@id": personId,
    },
  };
}

export function getProfilePageStructuredData(profile: WebsiteProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile-page`,
    url: SITE_URL,
    name: `${profile.name} Portfolio`,
    description: profile.sloganText,
    inLanguage: "en-US",
    isPartOf: {
      "@id": websiteId,
    },
    mainEntity: {
      "@id": personId,
    },
  };
}
