import { cache } from "react";
import { getSanityResumePage } from "@/sanity/content";
import { FALLBACK_RESUME_PAGE, type ResumePageContent } from "@/lib/profile";
import { cmsText } from "@/lib/utils";

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

export const getResumePage = cache(async (): Promise<ResumePageContent> => {
  try {
    const resumePage = await getSanityResumePage();

    if (!resumePage) {
      return FALLBACK_RESUME_PAGE;
    }

    return {
      name: cmsText(resumePage.name, FALLBACK_RESUME_PAGE.name),
      eyebrow: cmsText(resumePage.eyebrow, FALLBACK_RESUME_PAGE.eyebrow),
      summary: cmsText(resumePage.summary, FALLBACK_RESUME_PAGE.summary),
      // CMS-only content: anything the document omits stays empty so that
      // section hides instead of showing fallback copy.
      contactLinks: resumePage.contactLinks,
      education: resumePage.education,
      projects: resumePage.projects,
      experience: resumePage.experience,
      skills: resumePage.skills,
      seoDescription: resumePage.seoDescription,
      downloadUrl: getDownloadUrl(
        resumePage.resumeFile?.asset?.url,
        resumePage.resumeFile?.asset?.originalFilename,
      ),
    };
  } catch (error) {
    console.error("Resume content unavailable; using fallback:", error);
    return FALLBACK_RESUME_PAGE;
  }
});
