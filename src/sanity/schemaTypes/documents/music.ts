import { defineField, defineType } from "sanity";

export const music = defineType({
  name: "music",
  title: "Music",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "audio",
      title: "Audio file",
      type: "file",
      options: {
        accept: "audio/*",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
  },
});
