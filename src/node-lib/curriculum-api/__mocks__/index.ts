import { CurriculumApi } from "..";
import searchPageFixture from "../fixtures/searchPage.fixture";
import teachersHomePageFixture from "../fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "../fixtures/lessonDownloads.fixture";
import subjectListingFixture from "../fixtures/subjectListing.fixture";
import unitListingFixture from "../fixtures/unitListing.fixture";
import lessonListingFixture from "../fixtures/lessonListing.fixture";
import { tieredProgrammeListingFixture } from "../fixtures/tierListing.fixture";
import lessonOverviewFixture from "../fixtures/lessonOverview.fixture";

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
  subjectListing: jest.fn(async () => {
    return subjectListingFixture();
  }),
  lessonListing: jest.fn(async () => {
    return lessonListingFixture();
  }),
  unitListing: jest.fn(async () => {
    return unitListingFixture();
  }),
  tierListing: jest.fn(async () => {
    return tieredProgrammeListingFixture();
  }),
  lessonOverview: jest.fn(async () => {
    return lessonOverviewFixture();
  }),
};

export default curriculumApi;
