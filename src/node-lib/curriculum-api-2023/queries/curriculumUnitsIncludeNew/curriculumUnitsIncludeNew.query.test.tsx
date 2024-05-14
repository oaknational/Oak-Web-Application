import sdk from "../../sdk";

import curriculumUnitsIncludeNewQuery from "./curriculumUnitsIncludeNew.query";

describe("curriculum units query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumUnitsIncludeNewQuery({
        ...sdk,
        curriculumUnits: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "",
        phaseSlug: "",
        examboardSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test.skip("throws resource not found error if no rows are returned", async () => {
    await expect(async () => {
      await curriculumUnitsIncludeNewQuery({
        ...sdk,
        curriculumUnits: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "english",
        phaseSlug: "secondary",
        examboardSlug: "aqa",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
