import { CurriculumApi } from "..";
import searchPageFixture from "../fixtures/searchPage.fixture";
import teachersHomePageFixture from "../fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "../fixtures/lessonDownloads.fixture";
import subjectListingFixture from "../fixtures/subjectListing.fixture";
import unitListingFixture from "../fixtures/unitListing.fixture";
import unitListingPathsFixture from "../fixtures/unitListingPaths.fixture";
import lessonListingFixture from "../fixtures/lessonListing.fixture";
import { programmeListingFixture } from "../fixtures/tierListing.fixture";
import lessonListingPathsFixture from "../fixtures/lessonListingPaths.fixture";
import lessonOverviewFixture from "../fixtures/lessonOverview.fixture";
import lessonOverviewPathsFixture from "../fixtures/lessonOverviewPaths.fixture";
import lessonDownloadPathsFixture from "../fixtures/lessonDownloadPaths.fixture";
import programmeListingPathsFixture from "../fixtures/programmeListingPaths.fixture";
// import curriculumSubjectPhaseFixture from "../../curriculum-api-2023/fixtures/curriculumSubjectPhase.fixture";

const curriculumApi: CurriculumApi = {
  searchPage: jest.fn(async () => {
    return searchPageFixture();
  }),
  teachersHomePage: jest.fn(async () => {
    return teachersHomePageFixture();
  }),
  lessonDownloads: jest.fn(async () => {
    return lessonDownloadsFixtures();
  }),
  lessonDownloadPaths: jest.fn(async () => {
    return lessonDownloadPathsFixture();
  }),
  subjectListing: jest.fn(async () => {
    return subjectListingFixture();
  }),
  lessonListingPaths: jest.fn(async () => {
    return lessonListingPathsFixture();
  }),
  lessonListing: jest.fn(async () => {
    return lessonListingFixture();
  }),
  unitListing: jest.fn(async () => {
    return unitListingFixture();
  }),
  programmeListingPaths: jest.fn(async () => {
    return programmeListingPathsFixture();
  }),
  tierListing: jest.fn(async () => {
    return programmeListingFixture();
  }),
  unitListingPaths: jest.fn(async () => {
    return unitListingPathsFixture();
  }),
  lessonOverview: jest.fn(async () => {
    return lessonOverviewFixture();
  }),
  lessonOverviewPaths: jest.fn(async () => {
    return lessonOverviewPathsFixture();
  }),
  // curriculumSubjectPhase: jest.fn(async () => {
  //   return curriculumSubjectPhaseFixture();
  // }),
};

export default curriculumApi;
