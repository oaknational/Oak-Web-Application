// import curriculumOverviewSchema from "./curriculumOverview.schema";

import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

const curriculumOverviewQuery =
  (sdk: Sdk) =>
  async (args: {
    phaseSlug: string;
    subjectSlug: string;
    examboardSlug: string | null;
  }) => {
    console.log(sdk, args);
    if (!args.phaseSlug || !args.subjectSlug) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return curriculumOverviewMVFixture();
  };

export default curriculumOverviewQuery;
