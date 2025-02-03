import { isVisibleUnit, PartialFilters } from "./isVisibleUnit";

import { CombinedCurriculumData } from "@/pages-helpers/curriculum/docx";

const baseUnit = {
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
} as CombinedCurriculumData["units"][number];

describe("isVisibleUnit", () => {
  it("empty", () => {
    expect(
      isVisibleUnit(
        {
          years: ["10"],
          threads: [],
        },
        "7",
        baseUnit,
      ),
    ).toEqual(false);
  });

  it("matches subject", () => {
    const unit = {
      ...baseUnit,
      subjectcategories: null,
      tier: null,
      tier_slug: null,
    } as CombinedCurriculumData["units"][number];

    const filters: PartialFilters = {
      subjectCategories: [],
      childSubjects: ["biology"],
      tiers: ["foundation"],
      years: ["10"],
      threads: [],
    };
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });

  it("matches subject category", () => {
    const unit = {
      ...baseUnit,
      subjectcategories: [
        {
          id: 1,
          title: "Biology",
        },
      ],
    };

    const filters: PartialFilters = {
      subjectCategories: ["1"],
      childSubjects: [],
      tiers: [],
      years: ["10"],
      threads: [],
    };
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });

  it("matches subject category & tier", () => {
    const unit = {
      ...baseUnit,
      subjectcategories: [
        {
          id: 1,
          title: "Biology",
        },
      ],
      tier: "Foundation",
      tier_slug: "foundation",
    };

    const filters: PartialFilters = {
      subjectCategories: ["1"],
      childSubjects: [],
      tiers: ["foundation"],
      years: ["10"],
      threads: [],
    };
    expect(isVisibleUnit(filters, "10", unit)).toEqual(true);
  });
});
