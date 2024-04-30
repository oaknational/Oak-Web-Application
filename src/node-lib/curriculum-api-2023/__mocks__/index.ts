import unitListingFixture from "../fixtures/unitListing.fixture";
import { unitBrowseDataFixture } from "../fixtures/unitBrowseData.fixture";
import { subjectBrowseDataFixture } from "../fixtures/subjectBrowseData.fixture";

import { specialistSubjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/specialistSubjectListing.fixture";
import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";
import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import subjectPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import teachersHomePageFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersHomePage.fixture";
import specialistUnitListingFixture from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.fixture";
import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import lessonShareFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonShare.fixture";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import { subjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  | "subjectPhaseOptions"
  | "curriculumOverview"
  | "subjectListingPage"
  | "lessonListing"
  | "programmeListingPage"
  | "teachersHomePage"
  | "lessonOverviewCanonical"
  | "lessonDownloadsCanonical"
  | "pupilLessonQuery"
  | "pupilLessonListingQuery"
  | "pupilUnitListingQuery"
  | "pupilSubjectListingQuery"
  | "specialistSubjectListing"
  | "specialistUnitListing"
  | "specialistLessonOverviewCanonical"
  | "lessonShare"
  | "lessonOverview"
  | "lessonDownloads"
  | "unitListing"
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
  programmeListingPage: jest.fn(async () => {
    return programmeListingFixture();
  }),
  lessonListing: jest.fn(async () => {
    return lessonListingFixture();
  }),
  teachersHomePage: jest.fn(async () => {
    return teachersHomePageFixture();
  }),
  pupilLessonQuery: jest.fn(async () => {
    return {
      browseData: lessonBrowseDataFixture({}),
      content: lessonContentFixture({}),
    };
  }),
  pupilLessonListingQuery: jest.fn(async () => {
    return [lessonBrowseDataFixture({})];
  }),
  pupilUnitListingQuery: jest.fn(async () => {
    return [unitBrowseDataFixture({})];
  }),
  pupilSubjectListingQuery: jest.fn(async () => {
    return [subjectBrowseDataFixture({})];
  }),
  lessonShare: jest.fn(async () => {
    return lessonShareFixtures();
  }),
  lessonOverview: jest.fn(async () => {
    return lessonOverviewFixture();
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
  lessonDownloads: jest.fn(async () => {
    return lessonDownloadsFixtures();
  }),
  unitListing: jest.fn(async () => {
    return unitListingFixture();
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
