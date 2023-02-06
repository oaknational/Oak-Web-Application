import { CurriculumApi } from "../";
import teachersHomePageFixture from "../fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "../fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectTiersFixture from "../fixtures/teachersKeyStageSubjectTiers.fixture";
import teachersKeyStageSubjectTiersPathsFixture from "../fixtures/teachersKeyStageSubjectTiersPaths.fixture";
import teachersKeyStageSubjectUnitsFixture from "../fixtures/teachersKeyStageSubjectUnits.fixture";
import teachersKeyStageSubjectUnitsPathsFixture from "../fixtures/teachersKeyStageSubjectUnitsPaths.fixture";
import teachersLessonOverviewFixture from "../fixtures/teachersLessonOverview.fixture";
import teachersLessonOverviewPathsFixture from "../fixtures/teachersLessonOverviewPaths.fixture";
import teachersKeyStageSubjectUnitsLessonsFixture from "../fixtures/teachersKeyStageSubjectUnitLessons.fixture";

const curriculumApi: CurriculumApi = {
  // teachersHomePage: jest.mock(Promise.resolve(teachersHomePageFixture),
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
  teachersLessonOverviewPaths: jest.fn(async () => {
    return teachersLessonOverviewPathsFixture();
  }),
  teachersLessonOverview: jest.fn(async () => {
    return teachersLessonOverviewFixture();
  }),
};

export default curriculumApi;
