import { z } from "zod";

export const getUserListContentCountResponse = z.object({
  content_lists_aggregate: z.object({
    aggregate: z.object({
      count: z.number(),
    }),
  }),
});
