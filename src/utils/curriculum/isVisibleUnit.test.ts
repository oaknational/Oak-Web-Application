import { evalPathwayCondition, isVisibleUnit } from "./isVisibleUnit";

import { createFilter } from "@/fixtures/curriculum/filters";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createUnit } from "@/fixtures/curriculum/unit";

const baseUnit = createUnit({
  examboard: "Edexcel",
  examboard_slug: "edexcel",
  keystage_slug: "ks4",
  phase: "Secondary",
  phase_slug: "secondary",
  slug: "biological-molecules-and-enzymes",
  subject: "Biology",
  subject_slug: "biology",
  subject_parent: "Science",
  subject_parent_slug: "science",
  title: "Biological molecules and enzymes",

  cycle: "1",
  year: "10",
  pathway: null,
  pathway_slug: null,
  state: "published",
});

describe("isVisibleUnit", () => {
  it("empty", () => {
    expect(
      isVisibleUnit(
        createFilter({
          years: ["10"],
          threads: [],
        }),
        "7",
        baseUnit,
      ),
    ).toEqual(false);
  });

  it("matches subject", () => {
    const unit = createUnit({
      ...baseUnit,
      subjectcategories: null,
      tier: null,
      tier_slug: null,
    });

    const filters = createFilter({
      childSubjects: ["biology"],
      tiers: ["foundation"],
      years: ["10"],
    });
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });

  it("matches subject category", () => {
    const unit = createUnit({
      ...baseUnit,
      subjectcategories: [
        createSubjectCategory({
          id: 1,
          slug: "biology",
          title: "Biology",
        }),
      ],
    });

    const filters = createFilter({
      subjectCategories: ["biology"],
      years: ["10"],
    });
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });

  it("matches pathway", () => {
    const unit = createUnit({
      ...baseUnit,
      pathway_slug: "gcse",
      pathway: "GCSE",
    });

    const filters = createFilter({
      pathways: ["non_core"],
      years: ["10"],
    });
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });

  it("matches subject category & tier", () => {
    const unit = createUnit({
      ...baseUnit,
      subjectcategories: [
        createSubjectCategory({
          id: 1,
          slug: "biology",
          title: "Biology",
        }),
      ],
      tier: "Foundation",
      tier_slug: "foundation",
    });

    const filters = createFilter({
      subjectCategories: ["biology"],
      tiers: ["foundation"],
      years: ["10"],
      threads: [],
    });
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });
});

it("evalPathwayCondition", () => {
  expect(evalPathwayCondition("non_core", "core")).toEqual(false);
  expect(evalPathwayCondition("non_core", "gcse")).toEqual(true);
  expect(evalPathwayCondition("core", "core")).toEqual(true);
  expect(evalPathwayCondition("core", "gcse")).toEqual(false);
});
