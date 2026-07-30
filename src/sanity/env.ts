function requireEnvironmentVariable(
  value: string | undefined,
  name: string,
): string {
  const configuredValue = value?.trim();

  if (!configuredValue) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env.local and connect your own Sanity project.`,
    );
  }

  return configuredValue;
}

export const apiVersion = "2026-07-29";
export const projectId = requireEnvironmentVariable(
  process.env.SANITY_STUDIO_PROJECT_ID,
  "SANITY_STUDIO_PROJECT_ID",
);
export const dataset = requireEnvironmentVariable(
  process.env.SANITY_STUDIO_DATASET,
  "SANITY_STUDIO_DATASET",
);
