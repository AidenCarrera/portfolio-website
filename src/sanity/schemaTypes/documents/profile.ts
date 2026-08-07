import { defineArrayMember, defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Landing",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
    { name: "skills", title: "Skills" },
    { name: "projects", title: "Projects" },
    { name: "music", title: "Music" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "landingText",
      title: "Landing text",
      type: "text",
      rows: 3,
      group: "hero",
      description:
        "The large headline displayed on the homepage. Add a line break to render the second line in white.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sloganText",
      title: "Slogan text",
      type: "text",
      rows: 3,
      group: "hero",
      description: "The smaller supporting line beneath the landing headline.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "availabilityText",
      title: "Location and availability badge",
      type: "string",
      group: "hero",
      description:
        "The location and work availability shown in the badge on the homepage. Keep it under ~55 characters — the badge holds this on a single line, so a longer value will run off the edge on a phone.",
      initialValue: "Based in Tulsa, OK · Open to Relocation & Remote Roles",
      // 160 let through strings that overflow the badge on a narrow screen.
      validation: (rule) => rule.required().max(55),
    }),
    defineField({
      name: "aboutMe",
      title: "About me",
      type: "text",
      rows: 10,
      group: "about",
      description: "Separate paragraphs with a blank line.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      group: "about",
      options: { hotspot: true },
      description:
        "Shown beside the about summary. A monogram stands in until one is uploaded.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describes the photo for screen readers and search engines.",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "skillsIntro",
      title: "Skills section intro",
      type: "text",
      rows: 3,
      group: "skills",
      initialValue: "Technologies, frameworks, and tools I use to build.",
    }),
    defineField({
      name: "skills",
      title: "Skill Categories",
      type: "array",
      group: "skills",
      description:
        "Each entry is one card on the homepage — a name, an icon, and the skills inside it. The grid is two across, so an even number leaves no half-empty row.",
      of: [
        defineArrayMember({
          name: "skillCategory",
          title: "Skill Category",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Category Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: "Shown in the tile beside the category name.",
              options: {
                list: [
                  { title: "Code", value: "code" },
                  { title: "Layers", value: "layers" },
                  { title: "Audio", value: "audio" },
                  { title: "Terminal", value: "terminal" },
                  { title: "Database", value: "database" },
                  { title: "Chip", value: "chip" },
                  { title: "Palette", value: "palette" },
                  { title: "Tools", value: "tools" },
                ],
              },
              initialValue: "code",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Skills",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1).unique(),
            }),
          ],
          preview: {
            select: { title: "name", items: "items" },
            prepare({ title, items }) {
              return {
                title,
                subtitle: Array.isArray(items) ? items.join(", ") : undefined,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "projectsIntro",
      title: "Projects section intro",
      type: "text",
      rows: 4,
      group: "projects",
    }),
    defineField({
      name: "featuredProjects",
      title: "Pinned projects",
      type: "array",
      group: "projects",
      description:
        "Shown first, in this order. Any remaining slots are filled from the curated project order.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "featuredProjectCount",
      title: "Number of projects shown",
      type: "number",
      group: "projects",
      description:
        "The grid is two across, so an even number leaves no half-empty row.",
      initialValue: 4,
      validation: (rule) => rule.integer().min(1).max(12),
    }),
    defineField({
      name: "musicIntro",
      title: "Music section intro",
      type: "text",
      rows: 4,
      group: "music",
      initialValue:
        "I write, record, and produce original music. Explore my featured tracks, custom tape player, and the gear behind my sound.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      media: "portrait",
    },
  },
});
