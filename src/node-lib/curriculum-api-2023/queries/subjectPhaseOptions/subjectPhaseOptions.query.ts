import subjectPhaseOptionsSchema from "./subjectPhaseOptions.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const subjectPhaseOptionsQuery = (sdk: Sdk) => async () => {
  const res = await sdk.subjectPhaseOptions();
  const subjectPhaseOptions = res.options;
  if (subjectPhaseOptions.length === 0) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }
  const results = subjectPhaseOptionsSchema.parse(subjectPhaseOptions);
  return results.filter((result) => {
    return result.state === "published";
  });
};

export default subjectPhaseOptionsQuery;
