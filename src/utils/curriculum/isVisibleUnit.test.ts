import { isVisibleUnit } from "./isVisibleUnit";

import { YearSelection } from "@/components/CurriculumComponents/CurriculumVisualiser";
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
  subjectcategories: [
    {
      id: 1,
      title: "Biology",
    },
  ],
  tier: "Foundation",
  tier_slug: "foundation",
  title: "Biological molecules and enzymes",

  cycle: "1",
  year: "10",
  pathway: null,
  pathway_slug: null,
  state: "published",
} as CombinedCurriculumData["units"][number];

describe("isVisibleUnit", () => {
  it("empty", () => {
    expect(isVisibleUnit({}, "7", baseUnit)).toEqual(false);
  });

  it("matches subject", () => {
    const unit = {
      ...baseUnit,
      subjectcategories: null,
      tier: null,
      tier_slug: null,
    } as CombinedCurriculumData["units"][number];

    const yearSelection: YearSelection = {
      "10": {
        subjectCategory: null,
        subject: {
          subject_slug: "biology",
          subject: "Biology",
        },
        domain: null,
        tier: null,
      },
    };
    expect(isVisibleUnit(yearSelection, "10", unit)).toEqual(true);
  });

  it("matches subject & subject category", () => {
    const unit = {
      ...baseUnit,
      tier: null,
      tier_slug: null,
      subjectcategories: [
        {
          id: 1,
          title: "Biology",
        },
      ],
    };

    const yearSelection = {
      "10": {
        subjectCategory: {
          id: 1,
          title: "Biology",
        },
        subject: {
          subject_slug: "biology",
          subject: "Biology",
        },
        domain: null,
        tier: null,
      },
    };
    expect(isVisibleUnit(yearSelection, "10", unit)).toEqual(true);
  });

  it("matches subject, subject category & tier", () => {
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

    const yearSelection = {
      "10": {
        subjectCategory: {
          id: 1,
          title: "Biology",
        },
        subject: {
          subject_slug: "biology",
          subject: "Biology",
        },
        domain: null,
        tier: {
          tier: "Foundation",
          tier_slug: "foundation",
        },
      },
    };
    expect(isVisibleUnit(yearSelection, "10", unit)).toEqual(true);
  });
});
