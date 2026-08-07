import { defineArrayMember, defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Landing",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
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
