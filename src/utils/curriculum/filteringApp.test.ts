import { shouldDisplayFilter } from "./filteringApp";

import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";

describe("shouldDisplayFilter", () => {
  describe("years", () => {
    it("with data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test2" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
        keystages: [],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "years",
      );
      expect(result).toEqual(true);
    });

    it("with only one year", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7"],
        keystages: [],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7"] }),
        "years",
      );
      expect(result).toEqual(false);
    });

    it("no data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {},
        threadOptions: [],
        yearOptions: [],
        keystages: [],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: [] }),
        "years",
      );
      expect(result).toEqual(false);
    });
  });
});
