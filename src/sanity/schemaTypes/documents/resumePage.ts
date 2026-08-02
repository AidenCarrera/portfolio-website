import { defineArrayMember, defineField, defineType } from "sanity";

const requiredStringArray = (title: string) =>
  defineField({
    name: title.toLowerCase().replaceAll(" ", ""),
    title,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    validation: (rule) => rule.required().min(1).unique(),
  });

export const resumePage = defineType({
  name: "resumePage",
  title: "Resume",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "education", title: "Education" },
    { name: "projects", title: "Projects" },
    { name: "experience", title: "Experience" },
    { name: "skills", title: "Skills" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Header Tagline",
      type: "string",
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Professional Summary",
      type: "text",
      rows: 5,
      group: "header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactLinks",
      title: "Contact Links",
      type: "array",
      group: "header",
      of: [
        defineArrayMember({
          name: "contactLink",
          title: "Contact Link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https", "mailto"] }),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "GitHub", value: "github" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Email", value: "email" },
                  { title: "Website", value: "website" },
                  { title: "Generic link", value: "link" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "resumeFile",
      title: "Downloadable Resume PDF",
      type: "file",
      group: "header",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "object",
      group: "education",
      fields: [
        defineField({
          name: "school",
          title: "School",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "location",
          title: "Location",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "degree",
          title: "Degree",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "graduation",
          title: "Graduation",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "gpa",
          title: "GPA",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        requiredStringArray("Coursework"),
        requiredStringArray("Honors"),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projects",
      title: "Selected Projects",
      type: "array",
      group: "projects",
      of: [
        defineArrayMember({
          name: "resumeProject",
          title: "Project",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Repository URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https"] }),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "technologies",
              title: "Technologies",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1).unique(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "description" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      group: "experience",
      of: [
        defineArrayMember({
          name: "resumeExperience",
          title: "Experience Entry",
          type: "object",
          fields: [
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "organization",
              title: "Organization",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "dates",
              title: "Dates",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "highlights",
              title: "Highlights",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "role", subtitle: "organization" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "skills",
      title: "Skill Categories",
      type: "array",
      group: "skills",
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
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description:
        "Optional. When empty, the professional summary is used for search results.",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "summary" },
  },
});
