import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { requireSanityProject } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

const { projectId, dataset } = requireSanityProject();

export default defineConfig({
  name: "default",
  title: "Portfolio Studio",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        (template) =>
          template.schemaType !== "profile" &&
          template.schemaType !== "resumePage",
      ),
  },
});
