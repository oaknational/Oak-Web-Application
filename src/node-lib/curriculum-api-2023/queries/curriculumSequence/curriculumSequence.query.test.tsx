import sdk from "../../sdk";

import curriculumSequenceQuery from "./curriculumSequence.query";

describe("curriculum sequence query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumSequenceQuery({
        ...sdk,
        curriculumSequence: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "",
        phaseSlug: "",
        ks4OptionSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("throws resource not found error if no rows are returned", async () => {
    await expect(async () => {
      await curriculumSequenceQuery({
        ...sdk,
        curriculumSequence: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
