import { frontendHackForUnitIssues } from "./tab-helpers";

import { createUnit } from "@/fixtures/curriculum/unit";

describe("tab-helpers", () => {
  describe("frontendHackForUnitIssues", () => {
    test("only removes year 10 & 11 music lessons", () => {
      const units = [
        createUnit({ slug: "unit_1", subject_slug: "music", year: "7" }),
        createUnit({ slug: "unit_2", subject_slug: "music", year: "8" }),
        createUnit({ slug: "unit_3", subject_slug: "music", year: "9" }),
        createUnit({ slug: "unit_4", subject_slug: "music", year: "10" }),
        createUnit({ slug: "unit_5", subject_slug: "music", year: "11" }),
      ];
      const result = frontendHackForUnitIssues(units);
      expect(result).toEqual([units[0], units[1], units[2]]);
    });
  });
});
