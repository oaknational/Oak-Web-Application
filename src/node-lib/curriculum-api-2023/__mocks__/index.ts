import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import curriculumOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  "subjectPhaseOptions" | "curriculumSubjectPhaseOverviewPage"
> = {
  subjectPhaseOptions: jest.fn(async () => {
    return subjectPhaseOptionsFixture();
  }),
  curriculumSubjectPhaseOverviewPage: jest.fn(async () => {
    return curriculumOverviewFixture();
  }),
};

export default curriculumApi;
