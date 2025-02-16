import {
  getDefaultChildSubject,
  getDefaultFilter,
  getDefaultSubjectCategories,
  getDefaultTiers,
  getFilterData,
} from "./filtering";
import { Unit } from "./types";

import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("filtering", () => {
  it("getDefaultChildSubject", () => {
    const input = {
      "7": {
        units: [] as Unit[],
        childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
      } as CurriculumUnitsYearData[number],
      "8": {
        units: [] as Unit[],
        childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
      } as CurriculumUnitsYearData[number],
    };
    const out = getDefaultChildSubject(input);
    expect(out).toEqual(["biology"]);
  });
  it("getDefaultSubjectCategories", () => {
    const input = {
      "7": {
        units: [] as Unit[],
        subjectCategories: [{ id: 1 }],
      } as CurriculumUnitsYearData[number],
      "8": {
        units: [] as Unit[],
        subjectCategories: [{ id: 2 }],
      } as CurriculumUnitsYearData[number],
    };
    const out = getDefaultSubjectCategories(input);
    expect(out).toEqual(["1"]);
  });
  it("getDefaultTiers", () => {
    const input = {
      "7": {
        units: [] as Unit[],
        tiers: [{ tier_slug: "higher", tier: "Higher" }],
      } as CurriculumUnitsYearData[number],
      "8": {
        units: [] as Unit[],
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
          units: [] as Unit[],
          tiers: [{ tier_slug: "foundation", tier: "Foundation" }],
          childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
          subjectCategories: [{ id: 2 }],
        } as CurriculumUnitsYearData[number],
        "8": {
          units: [] as Unit[],
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
      subjectCategories: ["1"],
      threads: [],
      tiers: ["foundation"],
      years: ["7", "8"],
    });
  });
});

test("getFilterData", () => {
  const definition = {
    "7": {
      units: [] as Unit[],
      tiers: [{ tier_slug: "foundation", tier: "Foundation" }],
      childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
      subjectCategories: [{ id: 2 }],
    } as CurriculumUnitsYearData[number],
    "8": {
      units: [] as Unit[],
      tiers: [{ tier_slug: "higher", tier: "Higher" }],
      childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
      subjectCategories: [{ id: 1 }],
    } as CurriculumUnitsYearData[number],
  };
  const allYearOutput = getFilterData(definition, ["7", "8"]);
  expect(allYearOutput).toEqual({
    childSubjects: [
      {
        subject: "Biology",
        subject_slug: "biology",
      },
      {
        subject: "Physics",
        subject_slug: "physics",
      },
    ],
    subjectCategories: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
    tiers: [
      {
        tier: "Foundation",
        tier_slug: "foundation",
      },
      {
        tier: "Higher",
        tier_slug: "higher",
      },
    ],
  });

  const all7Output = getFilterData(definition, ["7"]);
  expect(all7Output).toEqual({
    childSubjects: [
      {
        subject: "Physics",
        subject_slug: "physics",
      },
    ],
    subjectCategories: [
      {
        id: 2,
      },
    ],
    tiers: [
      {
        tier: "Foundation",
        tier_slug: "foundation",
      },
    ],
  });

  const all8Output = getFilterData(definition, ["8"]);
  expect(all8Output).toEqual({
    childSubjects: [
      {
        subject: "Biology",
        subject_slug: "biology",
      },
    ],
    subjectCategories: [
      {
        id: 1,
      },
    ],
    tiers: [
      {
        tier: "Higher",
        tier_slug: "higher",
      },
    ],
  });
});
