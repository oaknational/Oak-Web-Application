import unitListingFixture from "../fixtures/unitListing.fixture";
import { unitBrowseDataFixture } from "../fixtures/unitBrowseData.fixture";
import { subjectBrowseDataFixture } from "../fixtures/subjectBrowseData.fixture";
import { LessonShareQuery } from "../queries/lessonShare/lessonShare.query";

import { specialistSubjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/specialistSubjectListing.fixture";
import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";
import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import teachersHomePageFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersHomePage.fixture";
import specialistUnitListingFixture from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.fixture";
import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import lessonShareFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonShare.fixture";
import lessonDownloadsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonDownloads.fixture";
import { subjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";
import { pupilProgrammeListingFixtureEBs } from "@/node-lib/curriculum-api-2023/fixtures/pupilProgrammeListing.fixture";
import { refreshedMVTimeFixture } from "@/node-lib/curriculum-api-2023/fixtures/refreshedMVTime.fixture";
import { teachersSitemapDataFixtureCamelCase } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";
import { mockedSiteMapResponse } from "@/node-lib/curriculum-api-2023/fixtures/pupilSiteMap.fixture";
import { type LessonDownloadsQuery } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.query";
import { type TeacherPreviewLessonDownloadsQuery } from "@/node-lib/curriculum-api-2023/queries/teacherPreviewLessonDownload/teacherPreviewLessonDownload.query";
import { LessonMediaClipsQueryReturn } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.query";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const curriculumApi: Pick<
  CurriculumApi,
  | "curriculumPhaseOptions"
  | "curriculumOverview"
  | "subjectListingPage"
  | "lessonListing"
  | "programmeListingPage"
  | "teachersHomePage"
  | "pupilLessonQuery"
  | "pupilPreviewLessonQuery"
  | "pupilLessonListingQuery"
  | "pupilUnitListingQuery"
  | "pupilSubjectListingQuery"
  | "pupilProgrammeListingQuery"
  | "specialistSubjectListing"
  | "specialistUnitListing"
  | "specialistLessonOverviewCanonical"
  | "lessonShare"
  | "lessonOverview"
  | "lessonDownloads"
  | "unitListing"
  | "refreshedMVTime"
  | "teachersSitemap"
  | "pupilsSitemap"
  | "teacherPreviewLesson"
  | "lessonMediaClips"
  | "betaLessonMediaClipsQuery"
  | "teachersPreviewLessonDownload"
  | "teachersPreviewUnitListing"
  | "teacherPreviewLessonListing"
> = {
  curriculumPhaseOptions: jest.fn(async () => {
    return curriculumPhaseOptionsFixture();
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
      additionalFiles: null,
    };
  }),
  pupilPreviewLessonQuery: jest.fn(async () => {
    return {
      browseData: lessonBrowseDataFixture({}),
      content: lessonContentFixture({}),
      additionalFiles: null,
    };
  }),
  teacherPreviewLesson: jest.fn(async () => {
    return {
      ...lessonOverviewFixture({
        lessonSlug: "running-as-a-team",
        yearTitle: "Year 10",
      }),
      lessonId: 1,
    };
  }),
  teachersPreviewLessonDownload: jest.fn(async () => {
    return lessonDownloadsFixtures();
  }) as jest.Mocked<TeacherPreviewLessonDownloadsQuery>,
  teachersPreviewUnitListing: jest.fn(async () => {
    return unitListingFixture();
  }),
  teacherPreviewLessonListing: jest.fn(async () => {
    return lessonListingFixture();
  }),
  betaLessonMediaClipsQuery: jest.fn(async () => {
    return {
      ...lessonMediaClipsFixtures(),
    };
  }) as jest.Mocked<LessonMediaClipsQueryReturn>,
  pupilLessonListingQuery: jest.fn(async () => {
    return {
      browseData: [lessonBrowseDataFixture({})],
      backLinkData: [{ programmeSlug: "programmeSlug", isLegacy: false }],
    };
  }),
  pupilUnitListingQuery: jest.fn(async () => {
    return [unitBrowseDataFixture({})];
  }),
  pupilSubjectListingQuery: jest.fn(async () => {
    return {
      curriculumData: [subjectBrowseDataFixture({})],
      subjectFeatures: [],
    };
  }),
  pupilProgrammeListingQuery: jest.fn(async () => {
    return pupilProgrammeListingFixtureEBs();
  }),
  lessonShare: jest.fn(async () => {
    return lessonShareFixtures();
  }) as jest.Mocked<LessonShareQuery>,
  lessonOverview: jest.fn(async () => {
    return lessonOverviewFixture();
  }),
  lessonDownloads: jest.fn(async () => {
    return lessonDownloadsFixtures();
  }) as jest.Mocked<LessonDownloadsQuery>,
  lessonMediaClips: jest.fn(async () => {
    return lessonMediaClipsFixtures();
  }) as jest.Mocked<LessonMediaClipsQueryReturn>,
  unitListing: jest.fn(async () => {
    return unitListingFixture();
  }),
  refreshedMVTime: jest.fn(async () => {
    return refreshedMVTimeFixture();
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
  teachersSitemap: jest.fn(async () => {
    return teachersSitemapDataFixtureCamelCase;
  }),

  pupilsSitemap: jest.fn(async () => {
    return mockedSiteMapResponse;
  }),
};

export default curriculumApi;
