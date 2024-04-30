import { getBaseSlugByYearFromProgrammeSlug } from "./pupils-browse-helpers";

describe("pupils-browse-helpers", () => {
  describe("getBaseSlugByYearFromProgrammeSlug ", () => {
    it("extracts the base slug from a programme slug", () => {
      expect(
        getBaseSlugByYearFromProgrammeSlug(
          "maths-non-gcse-secondary-year-10-aqa-higher",
        ),
      ).toEqual("maths-non-gcse-secondary-year-10");
    });
  });
});
