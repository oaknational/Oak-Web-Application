import * as z from "zod";

import { documentSchema, imageSchema } from "./base";
import { portableTextSchema } from "./portableText";

export const teamMemberSchema = z
  .object({
    name: z.string(),
    bioPortableText: portableTextSchema,
    image: imageSchema.nullish(),
    id: z.string(),
    role: z.string().nullish(),
    hotspot: z
      .object({
        height: z.number(),
        width: z.number(),
        x: z.number(),
        y: z.number(),
      })
      .nullish(),
    socials: z
      .object({
        twitterUsername: z.string().nullish(),
        linkedinUrl: z.string().nullish(),
      })
      .nullish(),
  })
  .merge(documentSchema);

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const teamMemberPreviewSchema = teamMemberSchema.pick({
  name: true,
  id: true,
  image: true,
  role: true,
});

export type TeamMemberPreview = z.infer<typeof teamMemberPreviewSchema>;
