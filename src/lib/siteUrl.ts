import "server-only";

const LOCAL_SITE_URL = "http://localhost:3000";

function getSiteUrl(): string {
  const configuredUrl = process.env.SITE_URL?.trim();
  const value = configuredUrl || LOCAL_SITE_URL;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      "SITE_URL must be an absolute URL, such as https://example.com.",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use the http or https protocol.");
  }

  return url.href.replace(/\/+$/, "");
}

export const SITE_URL = getSiteUrl();
