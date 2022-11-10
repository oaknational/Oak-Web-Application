import * as z from "zod";

/**
 * Fully parsing portable text has proved very error prone
 * and not really providing much value, so for now default to any
 */
export const portableTextSchema = z.array(z.any());

export type PortableTextJSON = z.infer<typeof portableTextSchema>;

export const unresolvedReferenceSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

export type UnresolvedReference = z.infer<typeof unresolvedReferenceSchema>;
