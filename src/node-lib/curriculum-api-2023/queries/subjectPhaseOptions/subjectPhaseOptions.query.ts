import subjectPhaseOptionsSchema from "./subjectPhaseOptions.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const subjectPhaseOptionsQuery = (sdk: Sdk) => async () => {
  const res = await sdk.subjectPhaseOptions();
  const subjectPhaseOptions = res.options;
  if (subjectPhaseOptions.length === 0) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }
  return subjectPhaseOptionsSchema.parse(subjectPhaseOptions);
};

export default subjectPhaseOptionsQuery;
