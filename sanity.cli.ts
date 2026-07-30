import { defineCliConfig } from "sanity/cli";
import { requireSanityProject } from "./src/sanity/env";

const appId = process.env.SANITY_STUDIO_APP_ID?.trim();

export default defineCliConfig({
  api: requireSanityProject(),
  ...(appId ? { deployment: { appId } } : {}),
});
