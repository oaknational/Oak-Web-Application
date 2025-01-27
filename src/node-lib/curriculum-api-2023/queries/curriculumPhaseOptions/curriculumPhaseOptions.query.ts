import { z } from "zod";

import curriculumPhaseOptionsSchema from "./curriculumPhaseOptions.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

const curriculumPhaseOptionsQuery = (sdk: Sdk) => async () => {
  const res = await sdk.curriculumPhaseOptions();
  const curriculumPhaseOptions = res.options;
  if (curriculumPhaseOptions.length === 0) {
    throw new OakError({ code: "curriculum-api/not-found" });
  }
  const results = curriculumPhaseOptionsSchema.parse(curriculumPhaseOptions);
  return results;
};

export type SubjectPhaseOptions = z.infer<typeof curriculumPhaseOptionsSchema>;

export default curriculumPhaseOptionsQuery;
