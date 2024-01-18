import sdk from "../../sdk";

import curriculumUnitsQuery from "./curriculumUnits.query";

describe("curriculum units query", () => {
  it("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumUnitsQuery({
        ...sdk,
        curriculumUnits: vi.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "",
        phaseSlug: "",
        examboardSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  it("throws resource not found error if no rows are returned", async () => {
    await expect(async () => {
      await curriculumUnitsQuery({
        ...sdk,
        curriculumUnits: vi.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "english",
        phaseSlug: "secondary",
        examboardSlug: "aqa",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
