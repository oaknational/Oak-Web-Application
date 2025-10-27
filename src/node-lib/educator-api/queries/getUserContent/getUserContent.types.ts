import { z } from "zod";

export const getUserContentResponse = z.object({
  users_content: z.array(
    z.object({
      users_content_lists: z
        .object({
          content: z.object({ unit_slug: z.string() }),
        })
        .nullable(),
    }),
  ),
});

export type UserContentResponse = z.infer<typeof getUserContentResponse>;
