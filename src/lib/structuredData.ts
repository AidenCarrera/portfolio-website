import { socialLinks } from "@/lib/socialLinks";
import { SITE_URL } from "@/lib/utils";

const siteUrl = SITE_URL.replace(/\/+$/, "");
const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

export const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: "Aiden Carrera",
      url: siteUrl,
      image: `${siteUrl}/developer-logo.svg`,
      jobTitle: "Software Engineer, Audio Programmer, and Music Producer",
      description:
        "Software engineer, audio programmer, musician, and music producer.",
      sameAs: socialLinks.map((link) => link.url),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: siteUrl,
      name: "Aiden Carrera Portfolio",
      description:
        "Software engineering, audio programming, and music production portfolio of Aiden Carrera.",
      inLanguage: "en-US",
      creator: {
        "@id": personId,
      },
    },
  ],
};

export const profilePageStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteUrl}/#profile-page`,
  url: siteUrl,
  name: "Aiden Carrera Portfolio",
  description:
    "Software engineering, audio programming, and music production portfolio of Aiden Carrera.",
  inLanguage: "en-US",
  isPartOf: {
    "@id": websiteId,
  },
  mainEntity: {
    "@id": personId,
  },
};
