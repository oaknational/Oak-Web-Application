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

const CTASchemaBase = z.object({
  label: z.string(),
});

export const CTASchema = z.discriminatedUnion("linkType", [
  CTASchemaBase.extend({
    linkType: z.literal("internal"),
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
      contentType: z.string(),
      slug: slugSchema.optional(),
    }),
  }),
  CTASchemaBase.extend({
    linkType: z.literal("external"),
    external: z.string().url(),
  }),
]);

export const imageSchema = z.object({
  asset: z.object({
    _id: z.string(),
    url: z.string(),
  }),
});

export const cardSchema = z.object({
  title: z.string().nonempty(),
  bodyPortableText: portableTextSchema,
  image: imageSchema.nullable().optional(),
  cta: CTASchema.nullable().optional(),
});

export const textBlockSchema = z.object({
  title: z.string().nonempty(),
  bodyPortableText: portableTextSchema,
  cta: CTASchema.nullable().optional(),
});

export const textAndMediaSchemaBase = z.object({
  title: z.string().nonempty(),
  bodyPortableText: portableTextSchema,
  cta: CTASchema.nullable().optional(),
  alignMedia: z.enum(["left", "right"]),
});

export const videoSchema = z.object({
  title: z.string(),
  video: z.object({
    asset: z.object({
      assetId: z.string(),
      playbackId: z.string(),
    }),
  }),
});

export const textAndMediaSchema = z.discriminatedUnion("mediaType", [
  textAndMediaSchemaBase.extend({
    mediaType: z.literal("image"),
    image: imageSchema,
  }),
  textAndMediaSchemaBase.extend({
    mediaType: z.literal("video"),
    video: videoSchema,
  }),
]);

export const blogWebinarCategory = z.object({
  title: z.string(),
  slug: slugSchema,
});
