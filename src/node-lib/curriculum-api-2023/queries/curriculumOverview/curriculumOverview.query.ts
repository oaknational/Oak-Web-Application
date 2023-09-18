// import { curriculumOverviewMVFixture } from "../../fixtures/curriculumOverview.fixture";

import curriculumOverviewSchema from "./curriculumOverview.schema";

// import OakError from "@/errors/OakError";
import { Sdk } from "@/node-lib/curriculum-api-2023/sdk";

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
    const res = await sdk.curriculumOverview(args);
    const curriculumOverview = res.curriculumOverview;

    if (!curriculumOverview) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    return curriculumOverviewSchema.parse(curriculumOverview);
    // return curriculumOverviewSchema.parse(curriculumOverviewMVFixture());
  };

export default curriculumOverviewQuery;
