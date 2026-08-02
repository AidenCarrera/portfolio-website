import { cache } from "react";
import { getSanityResumePage } from "@/sanity/content";
import type { SanityResumePage } from "@/sanity/types";

export interface ResumePageContent extends SanityResumePage {
  downloadUrl?: string;
}

function getDownloadUrl(
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

export const getResumePage = cache(
  async (): Promise<ResumePageContent | null> => {
    const resumePage = await getSanityResumePage();

    if (!resumePage) {
      return null;
    }

    return {
      ...resumePage,
      downloadUrl: getDownloadUrl(
        resumePage.resumeFile?.asset?.url,
        resumePage.resumeFile?.asset?.originalFilename,
      ),
    };
  },
);
