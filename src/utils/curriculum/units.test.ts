import { doUnitsHaveNc, findUnitOrOptionBySlug } from "./units";

import { createFilter } from "@/fixtures/curriculum/filters";
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
            createUnitOption({ slug: "u-0-1/uo-3" }),
            createUnitOption({ slug: "u-0-1/uo-3" }),
          ],
        }),
        createUnit({ slug: "u-0-2", tier_slug: "foundation" }),
        createUnit({ slug: "u-0-2", tier_slug: "higher" }),
        createUnit({
          slug: "u-0-3",
          subject_slug: "physics",
          subject_parent: "science",
        }),
        createUnit({
          slug: "u-0-3",
          subject_slug: "combined-science",
          subject_parent: "science",
        }),
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

  it("tiers", () => {
    const result1 = findUnitOrOptionBySlug(
      yearData,
      "u-0-2",
      createFilter({ tiers: ["foundation"] }),
    );
    expect(result1.unit).toEqual(
      expect.objectContaining({
        slug: "u-0-2",
        tier_slug: "foundation",
      }),
    );
    const result2 = findUnitOrOptionBySlug(
      yearData,
      "u-0-2",
      createFilter({ tiers: ["higher"] }),
    );
    expect(result2.unit).toEqual(
      expect.objectContaining({
        slug: "u-0-2",
        tier_slug: "higher",
      }),
    );
  });

  it("child subjects", () => {
    const result1 = findUnitOrOptionBySlug(
      yearData,
      "u-0-3",
      createFilter({ childSubjects: ["combined-science"] }),
    );
    expect(result1.unit).toEqual(
      expect.objectContaining({
        slug: "u-0-3",
        subject_slug: "combined-science",
      }),
    );
    const result2 = findUnitOrOptionBySlug(
      yearData,
      "u-0-3",
      createFilter({ childSubjects: ["physics"] }),
    );
    expect(result2.unit).toEqual(
      expect.objectContaining({
        slug: "u-0-3",
        subject_slug: "physics",
      }),
    );
  });
});

describe("doUnitsHaveNc", () => {
  test("none", () => {
    const output = doUnitsHaveNc([
      createUnit({ slug: "one" }),
      createUnit({ slug: "two" }),
      createUnit({ slug: "three" }),
    ]);
    expect(output).toEqual(false);
  });

  test("some", () => {
    const output = doUnitsHaveNc([
      createUnit({ slug: "one" }),
      createUnit({
        slug: "two",
        features: { national_curriculum_content: true },
      }),
      createUnit({ slug: "three" }),
    ]);
    expect(output).toEqual(true);
  });

  test("all", () => {
    const output = doUnitsHaveNc([
      createUnit({
        slug: "one",
        features: { national_curriculum_content: true },
      }),
      createUnit({
        slug: "two",
        features: { national_curriculum_content: true },
      }),
      createUnit({
        slug: "three",
        features: { national_curriculum_content: true },
      }),
    ]);
    expect(output).toEqual(true);
  });
});
