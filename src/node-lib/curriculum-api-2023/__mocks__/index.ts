import { specialistSubjectListingFixture2023 } from "../fixtures/specialistSubjectListing.fixture";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import { subjectListingFixture2023 } from "@/node-lib/curriculum-api/fixtures/subjectListing.fixture";
import teachersHomePageFixture from "@/node-lib/curriculum-api/fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api/fixtures/lessonDownloads.fixture";
import pupilLessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/pupilLessonOverview.fixture";
import specialistUnitListingFixture from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.fixture";
import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  | "subjectPhaseOptions"
  | "curriculumOverview"
  | "subjectListingPage"
  | "teachersHomePage"
  | "lessonOverviewCanonical"
  | "lessonDownloadsCanonical"
  | "pupilLessonOverview"
  | "pupilLessonOverviewCanonical"
  | "specialistSubjectListing"
  | "specialistUnitListing"
  | "specialistLessonOverviewCanonical"
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
  teachersHomePage: jest.fn(async () => {
    return teachersHomePageFixture();
  }),
  pupilLessonOverview: jest.fn(async () => {
    return pupilLessonOverviewFixture();
  }),
  pupilLessonOverviewCanonical: jest.fn(async () => {
    return pupilLessonOverviewFixture();
  }),
  lessonOverviewCanonical: jest.fn(async () => {
    return {
      ...lessonOverviewFixture(),
      pathways: [lessonOverviewFixture()],
    };
  }),
  lessonDownloadsCanonical: jest.fn(async () => {
    return {
      ...lessonDownloadsFixtures(),
      pathways: [lessonDownloadsFixtures()],
    };
  }),
  specialistSubjectListing: jest.fn(async () => {
    return {
      ...specialistSubjectListingFixture2023(),
    };
  }),
  specialistUnitListing: jest.fn(async () => {
    return {
      ...specialistUnitListingFixture(),
    };
  }),
  specialistLessonOverviewCanonical: jest.fn(async () => {
    return {
      ...specialistLessonOverviewFixture(),
      isSpecialist: true as const,
    };
  }),
};

export default curriculumApi;
