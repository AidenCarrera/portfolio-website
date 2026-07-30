import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./src/sanity/env";

const appId = process.env.SANITY_STUDIO_APP_ID?.trim();

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  ...(appId ? { deployment: { appId } } : {}),
});
