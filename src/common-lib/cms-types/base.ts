import * as z from "zod";

import { OmitKeepDiscriminated } from "../../utils/generics";

export const documentSchema = z.object({
  id: z.string(),
});

export const slugSchema = z
  .object({
    current: z.string().min(1),
  })
  .transform((slug) => slug.current);

export type Slug = z.infer<typeof slugSchema>;

export const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());

export const quoteSchema = z.object({
  text: z.string(),
  attribution: z.string().nullish(),
  role: z.string().nullish(),
  organisation: z.string().nullish(),
});

export type Quote = z.infer<typeof quoteSchema>;

export const imageAssetSchema = z.object({
  _id: z.string(),
  url: z.string(),
});

export const imageSchema = z.object({
  altText: z.string().min(1).nullish(),
  isPresentational: z.boolean().nullish(),
  asset: imageAssetSchema.nullish(),
  hotspot: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .nullish(),
});

export type Image = z.infer<typeof imageSchema>;

export const videoSchema = z.object({
  title: z.string(),
  captions: z.array(z.string()).nullish(),
  video: z.object({
    asset: z.object({
      assetId: z.string(),
      playbackId: z.string(),
      thumbTime: z
        .number()
        .nullish()
        .transform((val) => {
          return val === undefined ? null : val;
        }),
    }),
  }),
});

export type Video = z.infer<typeof videoSchema>;

export const blogWebinarCategorySchema = z.object({
  title: z.string(),
  slug: slugSchema,
});

export type BlogWebinarCategory = z.infer<typeof blogWebinarCategorySchema>;

export const attachmentSchema = z.object({
  title: z.string(),
  file: z.object({
    asset: z.object({
      extension: z.string(),
      size: z.number(),
      url: z.string(),
    }),
  }),
});

export const formSchema = z.object({
  title: z.string(),
});

/**
 * All content types that can be linked to from within sanity
 *
 * If you've ended up here because of a validation error
 * about internal.type not being defined, the fragments
 * in internalLinkFields.fragment.gql may be out of date.
 *
 * It'll need a separate inline fragment for each possible
 * document type allowed in sanity
 * ```
 *   ...on DocumentType {
 *     type: _type
 *   }
 * ```
 */
const internalLinkEntryTypes = [
  // For internal links with slugs
  z
    .object({ contentType: z.literal("webinar"), slug: slugSchema })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("newsPost"), slug: slugSchema })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("policyPage"), slug: slugSchema })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("landingPage"), slug: slugSchema })
    .merge(documentSchema),

  // For internal links to fixed pages
  z.object({ contentType: z.literal("homepage") }).merge(documentSchema),
  z.object({ contentType: z.literal("aboutCorePage") }).merge(documentSchema),
  z
    .object({ contentType: z.literal("aboutCorePage.whoWeAre") })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("aboutCorePage.board") })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("aboutCorePage.leadership") })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("aboutCorePage.partners") })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("aboutCorePage.workWithUs") })
    .merge(documentSchema),
  z
    .object({ contentType: z.literal("planningCorePage") })
    .merge(documentSchema),
  z.object({ contentType: z.literal("supportCorePage") }).merge(documentSchema),
  z.object({ contentType: z.literal("contactCorePage") }).merge(documentSchema),
  z
    .object({ contentType: z.literal("webinarListingPage") })
    .merge(documentSchema),
  z.object({ contentType: z.literal("newsListingPage") }).merge(documentSchema),

  // Other
  z
    .object({ contentType: z.literal("attachment") })
    .merge(attachmentSchema)
    .merge(documentSchema),
] as const;

export const internalLinkEntrySchema = z.discriminatedUnion("contentType", [
  ...internalLinkEntryTypes,
]);

export type InternalLinkEntry = z.infer<typeof internalLinkEntrySchema>;

export type CTAInternalLinkEntry = OmitKeepDiscriminated<
  InternalLinkEntry,
  "id"
>;

// Documents that can be referenced from within portable text
export const portableTextReferencedEntrySchema = z.discriminatedUnion(
  "contentType",
  [
    ...internalLinkEntryTypes,

    // Embedded content
    z
      .object({
        contentType: z.literal("sanity.imageAsset"),
        _type: z.literal("sanity.imageAsset"),
      })
      .merge(imageAssetSchema)
      .merge(documentSchema),

    z
      .object({ contentType: z.literal("video"), _type: z.literal("video") })
      .merge(videoSchema)
      .merge(documentSchema),
  ],
);

export type PortableTextReferencedEntry = z.infer<
  typeof portableTextReferencedEntrySchema
>;

export const seoSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  canonicalURL: z.string().nullish(),
});

export type Seo = z.infer<typeof seoSchema>;
