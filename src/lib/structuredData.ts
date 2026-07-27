import { socialLinks } from "@/lib/socialLinks";
import { SITE_URL } from "@/lib/utils";

const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

export const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: "Aiden Carrera",
      url: SITE_URL,
      image: `${SITE_URL}/developer-logo.svg`,
      jobTitle: "Software Engineer, Audio Programmer, and Music Producer",
      description:
        "Software engineer, audio programmer, musician, and music producer.",
      sameAs: socialLinks.map((link) => link.url),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: SITE_URL,
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
  "@id": `${SITE_URL}/#profile-page`,
  url: SITE_URL,
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
