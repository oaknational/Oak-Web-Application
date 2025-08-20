import { prettyFormat } from "../../docx/xml";

import { buildSheet } from "./buildSheet";

import { createYearData } from "@/fixtures/curriculum/yearData";
import { createUnit } from "@/fixtures/curriculum/unit";

describe("buildSheet", () => {
  test("ungrouped", () => {
    const cellStyleIndexMap = {};
    const formattedData = {
      yearData: {
        "7": createYearData({
          units: [
            createUnit({
              slug: "TEST_1",
              national_curriculum_content: [],
            }),
            createUnit({
              slug: "TEST_2",
              national_curriculum_content: [],
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["7"],
    };
    const year = "7";
    const slugs = {
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
    };
    const output = buildSheet(cellStyleIndexMap, formattedData, year, slugs);
    const xml = prettyFormat(output);
    expect(xml).toMatch(/TEST_1/);
    expect(xml).toMatch(/TEST_2/);
    expect(xml).toMatchSnapshot();
  });
});
