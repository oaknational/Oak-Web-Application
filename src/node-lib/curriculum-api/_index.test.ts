import curriculumApi from "./_index";

const teachersHomePage = jest.fn(() => ({ mv_key_stages: [] }));
const teachersKeyStageSubjects = jest.fn(() => ({ mv_subjects: [] }));
const teachersKeyStageSubjectUnits = jest.fn(() => ({ mv_units: [] }));

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
