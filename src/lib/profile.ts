import { cache } from "react";
import { getSanityProfile } from "@/sanity/content";

export interface WebsiteProfile {
  name: string;
  // Absent until a Sanity Profile or CONTACT_EMAIL supplies one.
  email?: string;
  resumeUrl?: string;
  aboutMe: string;
  landingText: string;
  sloganText: string;
}

export const DEFAULT_PROFILE: WebsiteProfile = {
  name: "Aiden Carrera",
  email: process.env.CONTACT_EMAIL?.trim() || undefined,
  aboutMe: `Hey, I'm Aiden. I'm a Computer Science student in the OSU Honors College building software across audio, artificial intelligence, web applications, and games.

I work primarily with C++, TypeScript, Python, Java, JUCE, React, Next.js, and OpenGL, focusing on audio programming, graphics, and AI. My projects' source code is available on GitHub.

I'm also a performer, composer, and producer. I perform with the OSU Jazz Band, Resistance Indoor Percussion, and other ensembles, and I write, record, mix, and master my own music.`,
  landingText: "Musician. Producer.\nDeveloper.",
  sloganText: "I build creative software and make original music.",
};

function getResumeDownloadUrl(
  url: string | undefined,
  originalFilename: string | undefined,
): string | undefined {
  if (!url) {
    return undefined;
  }

  const separator = url.includes("?") ? "&" : "?";
  const filename = originalFilename || "resume.pdf";
  return `${url}${separator}dl=${encodeURIComponent(filename)}`;
}

export const getWebsiteProfile = cache(async (): Promise<WebsiteProfile> => {
  const profile = await getSanityProfile();

  if (!profile) {
    return DEFAULT_PROFILE;
  }

  return {
    name: profile.name || DEFAULT_PROFILE.name,
    email: profile.email?.trim() || DEFAULT_PROFILE.email,
    resumeUrl: getResumeDownloadUrl(
      profile.resume?.asset?.url,
      profile.resume?.asset?.originalFilename,
    ),
    aboutMe: profile.aboutMe || DEFAULT_PROFILE.aboutMe,
    landingText: profile.landingText || DEFAULT_PROFILE.landingText,
    sloganText: profile.sloganText || DEFAULT_PROFILE.sloganText,
  };
});
