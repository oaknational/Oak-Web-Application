import * as z from "zod";

/**
 * Fully parsing portable text has proved very error prone
 * and not really providing much value, so for now default to any
 */
export const portableTextSchema = z.array(z.any());

export type PortableText = z.infer<typeof portableTextSchema>;
