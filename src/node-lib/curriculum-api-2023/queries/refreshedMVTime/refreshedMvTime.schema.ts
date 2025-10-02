import { z } from "zod";

const refreshedMvTimeSchema = z.object({
  data: z
    .strictObject({
      last_refresh_finish: z.string(),
      materializedview_name: z.string(),
    })
    .array(),
});

export default refreshedMvTimeSchema;
