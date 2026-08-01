import { defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "resume",
      title: "Resume",
      type: "file",
      description:
        "Optional PDF displayed as a download link on the homepage.",
      options: {
        accept: "application/pdf",
      },
    }),
    defineField({
      name: "landingText",
      title: "Landing text",
      type: "text",
      rows: 3,
      description:
        "The large headline displayed on the homepage. Add a line break to render the second line in white.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sloganText",
      title: "Slogan text",
      type: "text",
      rows: 3,
      description: "The smaller supporting line beneath the landing headline.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aboutMe",
      title: "About me",
      type: "text",
      rows: 10,
      description: "Separate paragraphs with a blank line.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
