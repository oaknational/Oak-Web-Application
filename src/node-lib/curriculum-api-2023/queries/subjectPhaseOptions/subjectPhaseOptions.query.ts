import { z } from "zod";

import subjectPhaseOptionsSchema from "./subjectPhaseOptions.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

type subjectPhaseOptionsQueryProps = { cycle?: string };
const subjectPhaseOptionsQuery =
  (sdk: Sdk) =>
  async (props: subjectPhaseOptionsQueryProps = {}) => {
    const { cycle = "1" } = props;
    const res = await sdk.subjectPhaseOptions();
    const subjectPhaseOptions = res.options;
    if (subjectPhaseOptions.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const results = subjectPhaseOptionsSchema.parse(subjectPhaseOptions);
    return results.filter((result) => {
      return result.cycle === cycle;
    });
  };

export type SubjectPhaseOptions = z.infer<typeof subjectPhaseOptionsSchema>;

export default subjectPhaseOptionsQuery;
