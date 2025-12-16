import { Sdk } from "../../sdk";

import { topNavResponseSchema } from "./topNav.schema";

import OakError from "@/errors/OakError";

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
