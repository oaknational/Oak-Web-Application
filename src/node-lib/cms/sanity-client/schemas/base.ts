import * as z from "zod";

export const documentSchema = z.object({
  id: z.string(),
});

export const slugSchema = z
  .object({
    current: z.string().nonempty(),
  })
  .transform((slug) => slug.current);

export type Slug = z.infer<typeof slugSchema>;

// @TODO: Proper shape here
export const portableTextSchema = z.array(z.any());

export type PortableText = z.infer<typeof portableTextSchema>;

export const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const cardSchema = z.object({
  title: z.string().nonempty(),
  image: z.any(),
  bodyPortableText: portableTextSchema,
});

export const CTASchema = z.object({
  label: z.string().nonempty(),
  linkType: z.enum(["internal", "external"]),
  external: z.string().nonempty(),
  internal: z.object({
    /**
     * If you've ended up here because of a validation error
     * about internal.type not being defined, the fragments
     * in cta.fragment.gql may be out of date.
     * It'll need a separate inline fragment for each possible
     * document type in the generated union, e.g.
     * ```
     *   ...on DocumentType {
     *     type: _type
     *   }
     * ```
     */
    type: z.string(),
    slug: slugSchema.optional(),
  }),
});

export const imageSchema = z.object({
  asset: z.object({
    _id: z.string(),
    url: z.string(),
  }),
});

export const textAndMediaSchema = z.object({
  title: z.string().nonempty(),
  bodyPortableText: portableTextSchema,
  image: imageSchema,
  alignMedia: z.enum(["left", "right"]),
  mediaType: z.enum(["image", "video"]),
});
