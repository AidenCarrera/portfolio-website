import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "githubRepository",
      title: "GitHub repository",
      type: "string",
      description:
        "Required matching key. Enter the exact GitHub owner/repository identity, for example octocat/hello-world. GitHub supplies the repository name, owner, links, topics, and dates.",
      validation: (rule) =>
        rule.required().regex(/^[^/\s]+\/[^/\s]+$/, {
          name: "owner/repository",
        }),
    }),
    defineField({
      name: "hiddenFromProjects",
      title: "Hide from Projects",
      type: "boolean",
      description:
        "Hide this repository from the Projects page, project detail routes, and sitemap while keeping its Sanity content.",
      initialValue: false,
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      description:
        "Optional portfolio priority within the curated sort. Lower numbers appear first, and positions 1–3 are automatically marked Featured. This does not affect the Newest or Name sorts.",
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: "repoNameOverwrite",
      title: "Repo name overwrite (optional)",
      type: "string",
      description:
        "Optional replacement for the repository name supplied by GitHub. Leave blank to use the GitHub repository name.",
    }),
    defineField({
      name: "cardDescription",
      title: "Card description overwrite (optional)",
      type: "text",
      rows: 3,
      description:
        "Optional replacement for the description supplied by GitHub. Used on both the Projects card and project detail page. Leave blank to use the GitHub repository description.",
    }),
    defineField({
      name: "tagsOverwrite",
      title: "Tags overwrite (optional)",
      type: "array",
      description:
        "Optional replacement for the repository topics supplied by GitHub. These tags control project filtering and appear on cards and detail pages. Leave empty to use the GitHub topics.",
      of: [
        defineArrayMember({
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description:
        "Optional description of your contribution or responsibility on this project.",
    }),
    defineField({
      name: "timeframe",
      title: "Timeframe",
      type: "string",
      description:
        "Optional human-readable timeframe, such as Fall 2025 or 2024–Present. GitHub remains authoritative for repository dates.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description:
        "Optional portfolio status shown on the project detail page.",
      options: {
        list: [
          { title: "Active", value: "Active" },
          { title: "Complete", value: "Complete" },
          { title: "Archived", value: "Archived" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      description:
        "Optional primary media for the project detail page, also used as the preview on the Projects card. Upload a still image or an animated GIF; GIFs keep playing on both. Cards without a hero image fall back to a placeholder. Alternative text is required when media is added.",
      options: { hotspot: true, accept: "image/gif,image/png,image/jpeg,image/webp" },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      description:
        "Optional concise achievements, technical accomplishments, awards, or notable outcomes.",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "detailContent",
      title: "Project content",
      type: "array",
      description:
        "Optional rich content for deeper project explanation on the detail page.",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "gallery",
      title: "Project gallery",
      type: "array",
      description:
        "Optional ordered project images. Drag items to change their display order; each image requires alternative text.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      githubRepository: "githubRepository",
      repoNameOverwrite: "repoNameOverwrite",
      cardDescription: "cardDescription",
      media: "heroImage",
    },
    prepare({ githubRepository, repoNameOverwrite, cardDescription }) {
      return {
        title: repoNameOverwrite || githubRepository,
        subtitle: cardDescription || undefined,
      };
    },
  },
});
