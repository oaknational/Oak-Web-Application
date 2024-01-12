import { CurriculumApi } from "..";
import searchPageFixture from "../fixtures/searchPage.fixture";
import teachersHomePageFixture from "../fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "../fixtures/lessonDownloads.fixture";
import { subjectListingFixture2023 } from "../fixtures/subjectListing.fixture";
import unitListingFixture from "../fixtures/unitListing.fixture";
import lessonListingFixture from "../fixtures/lessonListing.fixture";
import { tieredProgrammeListingFixture } from "../fixtures/tierListing.fixture";
import lessonOverviewFixture from "../fixtures/lessonOverview.fixture";
import lessonShareFixtures from "../fixtures/lessonShare.fixture";

const curriculumApi: CurriculumApi = {
  searchPage: vi.fn(async () => {
    return searchPageFixture();
  }),
  teachersHomePage: vi.fn(async () => {
    return teachersHomePageFixture();
  }),
  lessonDownloads: vi.fn(async () => {
    return lessonDownloadsFixtures();
  }),
  lessonShare: vi.fn(async () => {
    return lessonShareFixtures();
  }),
  lessonDownloadsCanonical: vi.fn(async () => {
    return {
      ...lessonDownloadsFixtures(),
      pathways: [lessonDownloadsFixtures()],
    };
  }),
  subjectListing: vi.fn(async () => {
    return subjectListingFixture2023();
  }),
  lessonListing: vi.fn(async () => {
    return lessonListingFixture();
  }),
  unitListing: vi.fn(async () => {
    return unitListingFixture();
  }),
  tierListing: vi.fn(async () => {
    return tieredProgrammeListingFixture();
  }),
  lessonOverview: vi.fn(async () => {
    return lessonOverviewFixture();
  }),
  lessonOverviewCanonical: vi.fn(async () => {
    return {
      ...lessonOverviewFixture(),
      pathways: [lessonOverviewFixture()],
    };
  }),
};

export default curriculumApi;
