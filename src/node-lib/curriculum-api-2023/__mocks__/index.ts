import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import curriculumOverviewTabFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  "subjectPhaseOptions" | "curriculumOverview"
> = {
  subjectPhaseOptions: jest.fn(async () => {
    return subjectPhaseOptionsFixture();
  }),
  curriculumOverview: jest.fn(async () => {
    return curriculumOverviewTabFixture();
  }),
};

export default curriculumApi;
