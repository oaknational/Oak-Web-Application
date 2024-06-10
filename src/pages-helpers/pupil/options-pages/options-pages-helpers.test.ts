import { getYearSlug } from "./options-pages-helpers";

import { programmeFieldsFixture } from "@/node-lib/curriculum-api-2023/fixtures/programmeFields.fixture";
import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

describe("options-pages-helpers", () => {
  describe("getYearSlug", () => {
    it("should throw an error if the yearSlug is not the same for all programmes", () => {
      const programmes: PupilProgrammeListingData[] = [
        {
          programmeFields: programmeFieldsFixture({
            overrides: { yearSlug: "year-10" },
          }),
          programmeSlug: "physics-test-slug",
          yearSlug: "year-10",
        },
        {
          programmeFields: programmeFieldsFixture({
            overrides: { yearSlug: "year-11" },
          }),
          programmeSlug: "maths-test-slug",
          yearSlug: "year-11",
        },
      ];
      // Test implementation
      expect(() => getYearSlug({ programmes: programmes })).toThrow(
        "The params provided are incorrect",
      );
    });
  });
});
