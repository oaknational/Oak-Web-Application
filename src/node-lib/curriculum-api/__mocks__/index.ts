import { CurriculumApi } from "..";
import searchPageFixture from "../fixtures/searchPage.fixture";
import teachersHomePageFixture from "../fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "../fixtures/lessonDownloads.fixture";
import subjectListingFixture from "../fixtures/subjectListing.fixture";
import unitListingFixture from "../fixtures/unitListing.fixture";
import unitListingPathsFixture from "../fixtures/unitListingPaths.fixture";
import lessonListingFixture from "../fixtures/lessonListing.fixture";
import tierListingFixture from "../fixtures/tierListing.fixture";
import lessonListingPathsFixture from "../fixtures/lessonListingPaths.fixtures";
import lessonOverviewFixture from "../fixtures/lessonOverview.fixture";
import lessonOverviewPathsFixture from "../fixtures/lessonOverviewPaths.fixture";

const curriculumApi: CurriculumApi = {
  // teachersHomePage: jest.mock(Promise.resolve(teachersHomePageFixture),
  searchPage: jest.fn(async () => {
    return searchPageFixture();
  }),
  teachersHomePage: jest.fn(async () => {
    return teachersHomePageFixture();
  }),
  lessonDownloads: jest.fn(async () => {
    return lessonDownloadsFixtures();
  }),
  subjectListing: jest.fn(async () => {
    return subjectListingFixture();
  }),
  getLessonListingPaths: jest.fn(async () => {
    return lessonListingPathsFixture();
  }),
  getLessonListing: jest.fn(async () => {
    return lessonListingFixture();
  }),
  unitListing: jest.fn(async () => {
    return unitListingFixture();
  }),
  tierListing: jest.fn(async () => {
    return tierListingFixture();
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
};

export default curriculumApi;
