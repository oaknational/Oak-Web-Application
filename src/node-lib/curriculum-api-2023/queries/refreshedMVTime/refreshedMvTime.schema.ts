import { z } from "zod";

const refreshedMvTimeSchema = z.object({
  data: z
    .object({
      last_refresh_finish: z.string().nullable(),
      materializedview_name: z.string(),
    })
    .strict()
    .array(),
});

export default refreshedMvTimeSchema;
