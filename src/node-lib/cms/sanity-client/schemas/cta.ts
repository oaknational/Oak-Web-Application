import * as z from "zod";

import { internalLinkEntrySchema } from "./base";

export const CTASchemaBase = z.object({
  label: z.string(),
});

export const CTASchema = z.discriminatedUnion("linkType", [
  CTASchemaBase.extend({
    linkType: z.literal("internal"),
    internal: internalLinkEntrySchema,
  }),
  CTASchemaBase.extend({
    linkType: z.literal("external"),
    external: z.string().url(),
  }),
]);
