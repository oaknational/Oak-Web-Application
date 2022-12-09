import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "./fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectUnitsPathsFixture from "./fixtures/teachersKeyStageSubjectUnitsPaths.fixture";
import _curriculumApi, { CurriculumApi } from "./_index";

export type {
  TeachersHomePageData,
  TeachersKeyStageSubjectsData,
  TeachersKeyStageSubjectUnitsData,
} from "./_index";

const curriculumApi: CurriculumApi = {
  ..._curriculumApi,
  teachersHomePage: async () => {
    return teachersHomePageFixture();
  },
  teachersKeyStageSubjects: async () => {
    return teachersKeyStageSubjectsFixture();
  },
  teachersKeyStageSubjectUnitsPaths: async () => {
    return teachersKeyStageSubjectUnitsPathsFixture();
  },
};

export default curriculumApi;
