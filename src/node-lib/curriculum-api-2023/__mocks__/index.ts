import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import { subjectListingFixture2023 } from "@/node-lib/curriculum-api/fixtures/subjectListing.fixture";
import teachersHomePageFixture from "@/node-lib/curriculum-api/fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api/fixtures/lessonDownloads.fixture";
import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  | "subjectPhaseOptions"
  | "curriculumOverview"
  | "subjectListingPage"
  | "teachersHomePage"
  | "lessonOverviewCanonical"
  | "lessonDownloadsCanonical"
  | "pupilLessonOverview"
> = {
  subjectPhaseOptions: vi.fn(async () => {
    return subjectPhaseOptionsFixture();
  }),
  curriculumOverview: vi.fn(async () => {
    return curriculumOverviewMVFixture();
  }),
  subjectListingPage: vi.fn(async () => {
    return subjectListingFixture2023();
  }),
  teachersHomePage: vi.fn(async () => {
    return teachersHomePageFixture();
  }),
  pupilLessonOverview: vi.fn(async () => {
    return pupilLessonOverviewFixture();
  }),
  lessonOverviewCanonical: vi.fn(async () => {    
    return {
      ...lessonOverviewFixture(),
      pathways: [lessonOverviewFixture()],
    };
  }),
  lessonDownloadsCanonical: vi.fn(async () => {
    return {
      ...lessonDownloadsFixtures(),
      pathways: [lessonDownloadsFixtures()],
    };
  }),
};

export default curriculumApi;
