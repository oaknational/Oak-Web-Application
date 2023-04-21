import { CurriculumApi } from "..";
import searchPageFixture from "../fixtures/searchPage.fixture";
import teachersHomePageFixture from "../fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "../fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectTiersFixture from "../fixtures/teachersKeyStageSubjectTiers.fixture";
import teachersKeyStageSubjectTiersPathsFixture from "../fixtures/teachersKeyStageSubjectTiersPaths.fixture";
import teachersKeyStageSubjectUnitsFixture from "../fixtures/teachersKeyStageSubjectUnits.fixture";
import teachersKeyStageSubjectUnitsPathsFixture from "../fixtures/teachersKeyStageSubjectUnitsPaths.fixture";
import teachersLessonOverviewFixture from "../fixtures/teachersLessonOverview.fixture";
import teachersLessonOverviewPathsFixture from "../fixtures/teachersLessonOverviewPaths.fixture";
import teachersKeyStageSubjectUnitsLessonsFixture from "../fixtures/teachersKeyStageSubjectUnitLessons.fixture";
import teachersKeyStageSubjectUnitsLessonsDownloadsFixtures from "../fixtures/teachersKeyStageSubjectUnitsLessonsDownloads.fixture";
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
  teachersKeyStageSubjects: jest.fn(async () => {
    return teachersKeyStageSubjectsFixture();
  }),
  teachersKeyStageSubjectTiersPaths: jest.fn(async () => {
    return teachersKeyStageSubjectTiersPathsFixture();
  }),
  teachersKeyStageSubjectTiers: jest.fn(async () => {
    return teachersKeyStageSubjectTiersFixture();
  }),
  teachersKeyStageSubjectUnitsPaths: jest.fn(async () => {
    return teachersKeyStageSubjectUnitsPathsFixture();
  }),
  teachersKeyStageSubjectUnits: jest.fn(async () => {
    return teachersKeyStageSubjectUnitsFixture();
  }),
  teachersKeyStageSubjectUnitLessons: jest.fn(async () => {
    return teachersKeyStageSubjectUnitsLessonsFixture();
  }),
  teachersKeyStageSubjectUnitLessonsDownloads: jest.fn(async () => {
    return teachersKeyStageSubjectUnitsLessonsDownloadsFixtures();
  }),
  teachersLessonOverviewPaths: jest.fn(async () => {
    return teachersLessonOverviewPathsFixture();
  }),
  teachersLessonOverview: jest.fn(async () => {
    return teachersLessonOverviewFixture();
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
