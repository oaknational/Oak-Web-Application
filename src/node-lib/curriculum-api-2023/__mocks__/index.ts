import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import { subjectListingFixture2023 } from "@/node-lib/curriculum-api/fixtures/subjectListing.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  "subjectPhaseOptions" | "curriculumOverview" | "subjectListingPage"
> = {
  subjectPhaseOptions: jest.fn(async () => {
    return subjectPhaseOptionsFixture();
  }),
  curriculumOverview: jest.fn(async () => {
    return curriculumOverviewMVFixture();
  }),
  subjectListingPage: jest.fn(async () => {
    return subjectListingFixture2023();
  }),
};

export default curriculumApi;
