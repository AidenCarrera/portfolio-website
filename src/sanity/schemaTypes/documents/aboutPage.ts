import { defineArrayMember, defineField, defineType } from "sanity";
import { imageFields, imageWithAlt } from "@/sanity/schemaTypes/fields";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
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
    imageWithAlt({ name: "portrait", title: "Portrait", group: "header" }),
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
          fields: imageFields({
            extra: [
              defineField({
                name: "displayOrder",
                title: "Display Order",
                type: "number",
                description:
                  "Lower numbers appear first. Photos without a number keep their existing order after numbered photos.",
                validation: (rule) => rule.integer().min(0),
              }),
            ],
          }),
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
