import curriculumOverviewSchema from "./curriculumOverview.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { Published_Mv_Curriculum_Overview_0_9_Bool_Exp } from "@/node-lib/curriculum-api-2023/generated/sdk";

const curriculumOverviewQuery =
  (sdk: Sdk) =>
  async (args: {
    phaseSlug: string;
    subjectSlug: string;
    includeNonCurriculum?: boolean;
  }) => {
    if (!args.phaseSlug || !args.subjectSlug) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    const where: Published_Mv_Curriculum_Overview_0_9_Bool_Exp = {
      phase_slug: { _eq: args.phaseSlug },
      subject_slug: { _eq: args.subjectSlug },
    };

    if (!args.includeNonCurriculum) {
      where.non_curriculum = { _eq: false };
    }

    const res = await sdk.curriculumOverview({ where });
    const [curriculumOverview] = res.curriculumOverview;

    if (!curriculumOverview) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return curriculumOverviewSchema.parse(curriculumOverview);
  };

export default curriculumOverviewQuery;
