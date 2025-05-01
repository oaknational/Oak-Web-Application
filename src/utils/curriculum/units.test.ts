import { findUnitOrOptionBySlug } from "./units";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import { createYearData } from "@/fixtures/curriculum/yearData";

describe("findUnitOrOptionBySlug", () => {
  const yearData = {
    "7": createYearData({
      units: [
        createUnit({ slug: "u-0-0" }),
        createUnit({
          slug: "u-0-1",
          unit_options: [
            createUnitOption({ slug: "u-0-1/uo-0" }),
            createUnitOption({ slug: "u-0-1/uo-1" }),
            createUnitOption({ slug: "u-0-1/uo-2" }),
          ],
        }),
        createUnit({ slug: "u-0-2" }),
      ],
    }),
    "8": createYearData({
      units: [
        createUnit({ slug: "u-1-0" }),
        createUnit({
          slug: "u-1-1",
          unit_options: [],
        }),
        createUnit({ slug: "u-1-2" }),
      ],
    }),
  };

  it("finds units", () => {
    const result = findUnitOrOptionBySlug(yearData, "u-0-1");
    expect(result).toEqual({
      unit: yearData["7"].units[1],
      unitOption: undefined,
    });
  });

  it("finds unit options", () => {
    const result = findUnitOrOptionBySlug(yearData, "u-0-1/uo-1");
    expect(result).toEqual({
      unit: yearData["7"].units[1],
      unitOption: yearData["7"].units[1]?.unit_options[1],
    });
  });

  it("nothing with no slug", () => {
    expect(findUnitOrOptionBySlug(yearData)).toEqual({
      unit: undefined,
      unitOption: undefined,
    });
  });

  it("nothing with invalid slug", () => {
    expect(findUnitOrOptionBySlug(yearData, "foobar")).toEqual({
      unit: undefined,
      unitOption: undefined,
    });
  });
});
