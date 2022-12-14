import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "./fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectTiersFixture from "./fixtures/teachersKeyStageSubjectTiers.fixture";
import teachersKeyStageSubjectTiersPathsFixture from "./fixtures/teachersKeyStageSubjectTiersPaths.fixture";
import teachersKeyStageSubjectUnitsFixture from "./fixtures/teachersKeyStageSubjectUnits.fixture";
import teachersKeyStageSubjectUnitsPathsFixture from "./fixtures/teachersKeyStageSubjectUnitsPaths.fixture";
import _curriculumApi, { CurriculumApi } from "./_index";

export type {
  TeachersHomePageData,
  TeachersKeyStageSubjectsData,
  TeachersKeyStageSubjectUnitsData,
  TeachersKeyStageSubjectTiersData,
  TeachersKeyStageSubjectUnitsLessonsData,
} from "./_index";

const curriculumApi: CurriculumApi = {
  ..._curriculumApi,
  teachersHomePage: async () => {
    return teachersHomePageFixture();
  },
  teachersKeyStageSubjects: async () => {
    return teachersKeyStageSubjectsFixture();
  },
  teachersKeyStageSubjectTiersPaths: async () => {
    return teachersKeyStageSubjectTiersPathsFixture();
  },
  teachersKeyStageSubjectTiers: async () => {
    return teachersKeyStageSubjectTiersFixture();
  },
  teachersKeyStageSubjectUnitsPaths: async () => {
    return teachersKeyStageSubjectUnitsPathsFixture();
  },
  teachersKeyStageSubjectUnits: async () => {
    return teachersKeyStageSubjectUnitsFixture();
  },
};

export default curriculumApi;
