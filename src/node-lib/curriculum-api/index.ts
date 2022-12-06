import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "./fixtures/teachersKeyStageSubjects.fixture";
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
};

export default curriculumApi;
