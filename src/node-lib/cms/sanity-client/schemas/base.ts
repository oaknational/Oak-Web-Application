import * as z from "zod";

export const documentSchema = z.object({
  id: z.string(),
});

export const slugSchema = z
  .object({
    current: z.string(),
  })
  .transform((slug) => slug.current);

export type Slug = z.infer<typeof slugSchema>;

// @TODO: Proper shape here
export const portableTextSchema = z.array(z.any());

export type PortableText = z.infer<typeof portableTextSchema>;

// @TODO: Don't preprocess then transform, just validate date(s) returns valid
export const dateSchema = z
  .preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date())
  .transform((date) => date.toISOString());
