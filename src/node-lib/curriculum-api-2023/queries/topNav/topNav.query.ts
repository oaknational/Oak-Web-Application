import z from "zod";
import { programmeFieldsSchema } from "@oaknational/oak-curriculum-schema";

import { Sdk } from "../../sdk";

import OakError from "@/errors/OakError";

const topNavResponseSchema = z.object({
  teachers: z.array(
    z.object({
      programme_fields: programmeFieldsSchema,
      features: z.object({ non_curriculum: z.boolean().nullish() }),
    }),
  ),
});
export type TopNavResponse = z.infer<typeof topNavResponseSchema>;

const topNavQuery = (sdk: Sdk) => async () => {
  const res = await sdk.topNav();

  const parsed = topNavResponseSchema.safeParse(res);

  if (!parsed || !parsed.success) {
    throw new OakError({
      code: "curriculum-api/internal-error",
    });
  }
};

export default topNavQuery;
