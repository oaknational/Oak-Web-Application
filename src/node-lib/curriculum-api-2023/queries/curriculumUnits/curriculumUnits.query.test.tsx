import sdk from "../../sdk";

import curriculumUnitsQuery from "./curriculumUnits.query";

describe("curriculumUnits()", () => {
  test("throws params incorrect error if slug is missing", async () => {
    await expect(async () => {
      await curriculumUnitsQuery({
        ...sdk,
        curriculumUnits: jest.fn(() => Promise.resolve({ units: [] })),
      })({ slug: "" });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("throws params incorrect error if slug is incorrect", async () => {
    await expect(async () => {
      await curriculumUnitsQuery({
        ...sdk,
        curriculumUnits: jest.fn(() => Promise.resolve({ units: [] })),
      })({ slug: "notavalidslug" });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("throws resource not found error if no rows are returned", async () => {
    await expect(async () => {
      await curriculumUnitsQuery({
        ...sdk,
        curriculumUnits: jest.fn(() => Promise.resolve({ units: [] })),
      })({ slug: "english-secondary-aqa" });
    }).rejects.toThrow(`Resource not found`);
  });
});
