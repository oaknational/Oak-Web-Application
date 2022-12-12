import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "./fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectUnitsFixture from "./fixtures/teachersKeyStageSubjectUnits.fixture";
import curriculumApi from "./_index";

const teachersHomePage = jest.fn(() => ({
  mv_key_stages: teachersHomePageFixture().keyStages,
}));
const teachersKeyStageSubjects = jest.fn(() => ({
  mv_subjects: teachersKeyStageSubjectsFixture().subjects,
}));
const teachersKeyStageSubjectUnits = jest.fn(() => ({
  mv_key_stages: [
    {
      slug: teachersKeyStageSubjectUnitsFixture().keyStageSlug,
      title: teachersKeyStageSubjectUnitsFixture().keyStageTitle,
    },
  ],
  mv_subjects: [
    {
      slug: teachersKeyStageSubjectUnitsFixture().subjectSlug,
      title: teachersKeyStageSubjectUnitsFixture().subjectTitle,
    },
  ],
  mv_units: teachersKeyStageSubjectUnitsFixture().units,
}));

jest.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    teachersHomePage: (...args: []) => teachersHomePage(...args),
    teachersKeyStageSubjects: (...args: []) =>
      teachersKeyStageSubjects(...args),
    teachersKeyStageSubjectUnits: (...args: []) =>
      teachersKeyStageSubjectUnits(...args),
  }),
}));
describe("curriculum-api", () => {
  test("teachersHomePage", async () => {
    await curriculumApi.teachersHomePage();
    expect(teachersHomePage).toHaveBeenCalled();
  });
  test("teachersKeyStageSubjects", async () => {
    await curriculumApi.teachersKeyStageSubjects({ keyStageSlug: "ks123" });
    expect(teachersKeyStageSubjects).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
    });
  });
  test("teachersKeyStageSubjectUnits", async () => {
    await curriculumApi.teachersKeyStageSubjectUnits({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
    });
    expect(teachersKeyStageSubjectUnits).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
    });
  });
});
