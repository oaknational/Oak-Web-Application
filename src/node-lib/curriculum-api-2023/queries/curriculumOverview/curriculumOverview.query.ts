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
    // const res = await sdk.curriculumOverview({
    //   subjectSlug: args.subjectSlug,
    //   examboardSlug: args.examboardSlug,
    //   phaseSlug: args.phaseSlug,
    // });

    // const [programmes] = res.programmes;

    // if (!programmes) {
    //   throw new OakError({ code: "curriculum-api/not-found" });
    // }

    // return curriculumOverviewMVFixture.parse();
    return curriculumOverviewMVFixture();
  };

export default curriculumOverviewQuery;
