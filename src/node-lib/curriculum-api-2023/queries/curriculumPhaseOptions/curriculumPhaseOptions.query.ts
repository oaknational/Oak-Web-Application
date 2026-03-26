import { z } from "zod";

import curriculumPhaseOptionsSchema from "./curriculumPhaseOptions.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { Published_Mv_Curriculum_Phase_Options_0_4_Bool_Exp } from "@/node-lib/curriculum-api-2023/generated/sdk";

const curriculumPhaseOptionsQuery =
  (sdk: Sdk) => async (args?: { includeNonCurriculum?: boolean }) => {
    const where: Published_Mv_Curriculum_Phase_Options_0_4_Bool_Exp = {};

    if (!args?.includeNonCurriculum) {
      where.non_curriculum = { _eq: false };
    }

    const res = await sdk.curriculumPhaseOptions({ where });
    const curriculumPhaseOptions = res.options;
    if (curriculumPhaseOptions.length === 0) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }
    const results = curriculumPhaseOptionsSchema.parse(curriculumPhaseOptions);
    return results;
  };

export type CurriculumPhaseOptions = z.infer<
  typeof curriculumPhaseOptionsSchema
>;

export default curriculumPhaseOptionsQuery;
