import { defineField, type FieldDefinition, type ImageOptions } from "sanity";

const ALT_DESCRIPTION =
  "Describes the image for screen readers and search engines.";

/**
 * The alt/caption pair every uploaded image carries. Alt is required so an
 * image can never reach the site unlabelled; callers that need more (a display
 * order, say) append their own fields.
 */
export function imageFields({
  caption = true,
  extra = [],
}: {
  /** Some images are shown without a caption slot. */
  caption?: boolean;
  extra?: FieldDefinition[];
} = {}): FieldDefinition[] {
  return [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: ALT_DESCRIPTION,
      validation: (rule) => rule.required(),
    }),
    ...(caption
      ? [
          defineField({
            name: "caption",
            title: "Caption",
            type: "string",
            description: "Shown beneath the image.",
          }),
        ]
      : []),
    ...extra,
  ];
}

/** A standalone image field, hotspot enabled, with `imageFields` inside it. */
export function imageWithAlt({
  name,
  title,
  group,
  description,
  options,
  caption,
  extra,
}: {
  name: string;
  title: string;
  group?: string;
  description?: string;
  options?: ImageOptions;
  caption?: boolean;
  extra?: FieldDefinition[];
}) {
  return defineField({
    name,
    title,
    type: "image",
    ...(group ? { group } : {}),
    ...(description ? { description } : {}),
    options: { hotspot: true, ...options },
    fields: imageFields({ caption, extra }),
  });
}
