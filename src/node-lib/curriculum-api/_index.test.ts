import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "./fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectTiersFixture from "./fixtures/teachersKeyStageSubjectTiers.fixture";
import teachersKeyStageSubjectUnitsFixture from "./fixtures/teachersKeyStageSubjectUnits.fixture";
import curriculumApi from "./_index";

const teachersHomePage = jest.fn(() => ({
  mv_key_stages: teachersHomePageFixture().keyStages,
}));
const teachersKeyStageSubjects = jest.fn(() => ({
  mv_subjects: teachersKeyStageSubjectsFixture().subjects,
}));
const teachersKeyStageSubjectTiers = jest.fn(() => ({
  mv_key_stages: [
    {
      slug: teachersKeyStageSubjectTiersFixture().keyStageSlug,
      title: teachersKeyStageSubjectTiersFixture().keyStageTitle,
    },
  ],
  mv_subjects: [
    {
      slug: teachersKeyStageSubjectTiersFixture().subjectSlug,
      title: teachersKeyStageSubjectTiersFixture().subjectTitle,
    },
  ],
  mv_tiers: teachersKeyStageSubjectTiersFixture().tiers,
}));
const teachersKeyStageSubjectUnitsPaths = jest.fn(() => ({
  mv_subjects: [],
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
  mv_tiers: teachersKeyStageSubjectUnitsFixture().tiers,
  mv_units: teachersKeyStageSubjectUnitsFixture().units,
}));

jest.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    teachersHomePage: (...args: []) => teachersHomePage(...args),
    teachersKeyStageSubjects: (...args: []) =>
      teachersKeyStageSubjects(...args),
    teachersKeyStageSubjectTiers: (...args: []) =>
      teachersKeyStageSubjectTiers(...args),
    teachersKeyStageSubjectUnits: (...args: []) =>
      teachersKeyStageSubjectUnits(...args),
    teachersKeyStageSubjectUnitsPaths: (...args: []) =>
      teachersKeyStageSubjectUnitsPaths(...args),
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
  test("teachersKeyStageSubjectUnitsPaths", async () => {
    await curriculumApi.teachersKeyStageSubjectUnitsPaths();
    expect(teachersKeyStageSubjectUnitsPaths).toHaveBeenCalled();
  });
  test("teachersKeyStageSubjectTiers", async () => {
    await curriculumApi.teachersKeyStageSubjectTiers({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
    });
    expect(teachersKeyStageSubjectTiers).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
    });
  });
});
