import {
  getDefaultChildSubject,
  getDefaultFilter,
  getDefaultSubjectCategories,
  getDefaultTiers,
} from "./filtering";
import { Unit } from "./types";

import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("filtering", () => {
  it("getDefaultChildSubject", () => {
    const out = getDefaultChildSubject([
      { subject_parent: "science", subject_slug: "biology" },
      { subject_parent: "science", subject_slug: "physics" },
    ] as Unit[]);
    expect(out).toEqual(["biology"]);
  });
  it("getDefaultSubjectCategories", () => {
    const out = getDefaultSubjectCategories([
      { subjectcategories: [{ id: 1 }] },
      { subjectcategories: [{ id: 2 }] },
    ] as Unit[]);
    expect(out).toEqual(["1"]);
  });
  it("getDefaultTiers", () => {
    const out = getDefaultTiers([
      { tier_slug: "higher", tier: "Higher" },
      { tier_slug: "foundation", tier: "Foundation" },
    ] as Unit[]);
    expect(out).toEqual(["foundation"]);
  });

  it("getDefaultFilter", () => {
    const out = getDefaultFilter({
      yearData: {
        "7": {
          units: [
            {
              subject_parent: "science",
              subject_slug: "biology",
              subjectcategories: [{ id: 1 }],
              tier_slug: "higher",
              tier: "Higher",
            },
            {
              subject_parent: "science",
              subject_slug: "physics",
              subjectcategories: [{ id: 2 }],
              tier_slug: "foundation",
              tier: "Foundation",
            },
          ],
        },
      } as unknown as CurriculumUnitsYearData,
      threadOptions: [],
      yearOptions: ["7"],
    });
    expect(out).toEqual({
      childSubjects: ["biology"],
      subjectCategories: ["1"],
      threads: [],
      tiers: ["foundation"],
      years: ["7"],
    });
  });
});
