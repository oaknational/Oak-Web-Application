import { z } from "zod";

export const getUserContentResponse = z.object({
  users_content: z.array(
    z.object({
      content: z.object({ unit_slug: z.string() }),
    }),
  ),
});
