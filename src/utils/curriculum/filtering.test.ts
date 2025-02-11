import {
  getDefaultChildSubject,
  getDefaultFilter,
  getDefaultSubjectCategories,
  getDefaultTiers,
} from "./filtering";

import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("filtering", () => {
  it("getDefaultChildSubject", () => {
    const input = {
      "7": {
        childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
      } as CurriculumUnitsYearData[number],
      "8": {
        childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
      } as CurriculumUnitsYearData[number],
    };
    const out = getDefaultChildSubject(input);
    expect(out).toEqual(["biology"]);
  });
  it("getDefaultSubjectCategories", () => {
    const input = {
      "7": {
        subjectCategories: [{ id: 1 }],
      } as CurriculumUnitsYearData[number],
      "8": {
        subjectCategories: [{ id: 2 }],
      } as CurriculumUnitsYearData[number],
    };
    const out = getDefaultSubjectCategories(input);
    expect(out).toEqual(["1"]);
  });
  it("getDefaultTiers", () => {
    const input = {
      "7": {
        tiers: [{ tier_slug: "higher", tier: "Higher" }],
      } as CurriculumUnitsYearData[number],
      "8": {
        tiers: [{ tier_slug: "foundation", tier: "Foundation" }],
      } as CurriculumUnitsYearData[number],
    };
    const out = getDefaultTiers(input);
    expect(out).toEqual(["foundation"]);
  });

  it("getDefaultFilter", () => {
    const out = getDefaultFilter({
      yearData: {
        "7": {
          tiers: [{ tier_slug: "foundation", tier: "Foundation" }],
          childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
          subjectCategories: [{ id: 2 }],
        } as CurriculumUnitsYearData[number],
        "8": {
          tiers: [{ tier_slug: "higher", tier: "Higher" }],
          childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
          subjectCategories: [{ id: 1 }],
        } as CurriculumUnitsYearData[number],
      },
      threadOptions: [],
      yearOptions: ["7", "8"],
    });
    expect(out).toEqual({
      childSubjects: ["biology"],
      subjectCategories: ["2"],
      threads: [],
      tiers: ["foundation"],
      years: ["7", "8"],
    });
  });
});
