export const apiVersion = "2026-07-29";

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID?.trim() ?? "";
export const dataset = process.env.SANITY_STUDIO_DATASET?.trim() ?? "";

// Sanity only enriches the site, so the website stays up on its in-repo
// defaults when the project is unconfigured or deliberately switched off.
export const isSanityEnabled =
  Boolean(projectId && dataset) && process.env.SANITY_DISABLED !== "true";

// The Studio cannot run without a real project, so its config fails loudly.
export function requireSanityProject(): {
  projectId: string;
  dataset: string;
} {
  if (!projectId || !dataset) {
    throw new Error(
      "Missing SANITY_STUDIO_PROJECT_ID or SANITY_STUDIO_DATASET. Copy .env.example to .env.local and connect your own Sanity project.",
    );
  }

  return { projectId, dataset };
}
