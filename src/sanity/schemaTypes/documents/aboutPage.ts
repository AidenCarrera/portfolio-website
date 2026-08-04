import { defineArrayMember, defineField, defineType } from "sanity";

const photo = (name: string, title: string, group: string) =>
  defineField({
    name,
    title,
    type: "image",
    group,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt Text",
        type: "string",
        description: "Describes the photo for screen readers and search engines.",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "caption",
        title: "Caption",
        type: "string",
        description: "Shown beneath the photo.",
      }),
    ],
  });

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "skills", title: "Skills" },
    { name: "gallery", title: "Gallery" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Header Tagline",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Page Heading",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 12,
      group: "header",
      description: "Separate paragraphs with a blank line.",
      validation: (rule) => rule.required(),
    }),
    photo("portrait", "Portrait", "header"),
    defineField({
      name: "locationLabel",
      title: "Location",
      type: "string",
      group: "header",
    }),
    defineField({
      name: "graduationLabel",
      title: "Graduation",
      type: "string",
      group: "header",
    }),
    defineField({
      name: "availabilityLabel",
      title: "Availability",
      type: "string",
      group: "header",
    }),
    defineField({
      name: "skillsHeading",
      title: "Skills Section Heading",
      type: "string",
      group: "skills",
      initialValue: "Skills",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "skills",
      title: "Skill Categories",
      type: "array",
      group: "skills",
      description:
        "Each entry is one category — a name plus the skills inside it. The page renders one group of pills per category, in this order.",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          name: "aboutSkillCategory",
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
      name: "galleryHeading",
      title: "Gallery Heading",
      type: "string",
      group: "gallery",
      initialValue: "Photos",
      description:
        "The gallery section only renders once at least one photo is added.",
    }),
    defineField({
      name: "galleryIntro",
      title: "Gallery Intro",
      type: "text",
      rows: 3,
      group: "gallery",
    }),
    defineField({
      name: "gallery",
      title: "Photos",
      type: "array",
      group: "gallery",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description:
                "Describes the photo for screen readers and search engines.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Shown beneath the photo in the gallery.",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description:
        "Optional. When empty, the first paragraph of the introduction is used for search results.",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "eyebrow", media: "portrait" },
  },
});
