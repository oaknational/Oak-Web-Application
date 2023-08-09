import * as z from "zod";

import { internalLinkEntrySchema } from "./base";

const linkTypeInternal = z.object({
  linkType: z.literal("internal"),
  internal: internalLinkEntrySchema,
});

const linkTypeExternal = z.object({
  linkType: z.literal("external"),
  external: z.string().url(),
});

const linkTypeAnchor = z.object({
  linkType: z.literal("anchor"),
  /**
   * Allow lowercase alphanumeric with dashes (like a slug)
   * with the formBlock fallback for back-compat
   */
  anchor: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .or(z.literal("formBlock")),
});

export const linkSchema = z.discriminatedUnion("linkType", [
  linkTypeInternal,
  linkTypeExternal,
  linkTypeAnchor,
]);

export type Link = z.infer<typeof linkSchema>;

/**
 * A CTA is really just a link with a label, but with some extra
 * schema ceremony as we can't extend a zod discriminatedUnion
 */

export const CTASchemaBase = z.object({
  label: z.string(),
});

export const CTASchema = z.discriminatedUnion("linkType", [
  CTASchemaBase.merge(linkTypeInternal),
  CTASchemaBase.merge(linkTypeExternal),
  CTASchemaBase.merge(linkTypeAnchor),
]);

export type CTA = z.infer<typeof CTASchema>;
