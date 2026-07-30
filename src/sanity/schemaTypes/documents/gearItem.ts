import { defineField, defineType } from "sanity";

const gearTypes = [
  { title: "Instrument", value: "instrument" },
  { title: "Hardware", value: "hardware" },
  { title: "Software", value: "software" },
  { title: "Instrument Plugin", value: "instrumentPlugin" },
  { title: "Mixing Plugin", value: "mixingPlugin" },
];

export const gearItem = defineType({
  name: "gearItem",
  title: "Gear Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: gearTypes,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Optional sub-group such as Dynamics, EQ, Reverb & Delay, Audio Interface, Guitar, or Synth.",
    }),
    defineField({
      name: "manufacturer",
      title: "Manufacturer",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description:
        "Optional photo of the gear shown on its card. Alternative text is required when an image is added.",
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
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Give this item extra emphasis. Featured instruments, hardware, and software fill a wider slot in the grid; featured plugins are highlighted in the list.",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      description:
        "Lower numbers appear first within the item's top-level section.",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "sortOrder",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "name",
      type: "type",
      category: "category",
      manufacturer: "manufacturer",
      featured: "featured",
      media: "image",
    },
    prepare({ title, type, category, manufacturer, featured, media }) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: [manufacturer, category, type].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
