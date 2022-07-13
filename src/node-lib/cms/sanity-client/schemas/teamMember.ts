import * as z from "zod";

import { documentSchema } from "./base";

export const teamMemberSchema = z
  .object({
    name: z.string(),
    bio: z.string(),
    id: z.string(),
  })
  .merge(documentSchema);

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const teamMemberPreviewSchema = teamMemberSchema.pick({
  name: true,
  id: true,
});

export type TeamMemberPreview = z.infer<typeof teamMemberPreviewSchema>;
