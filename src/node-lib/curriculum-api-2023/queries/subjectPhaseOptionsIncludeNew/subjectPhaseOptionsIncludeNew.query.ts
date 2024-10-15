import subjectPhaseOptionsIncludeNewSchema from "./subjectPhaseOptionsIncludeNew.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const subjectPhaseOptionsIncludeNewQuery = (sdk: Sdk) => async () => {
  console.log("test");
  const res = await sdk.subjectPhaseOptionsIncludeNew();
  console.log({ res });
  const subjectPhaseOptionsIncludeNew = res.options;
  if (subjectPhaseOptionsIncludeNew.length === 0) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }
  return subjectPhaseOptionsIncludeNewSchema.parse(
    subjectPhaseOptionsIncludeNew,
  );
};

export default subjectPhaseOptionsIncludeNewQuery;
