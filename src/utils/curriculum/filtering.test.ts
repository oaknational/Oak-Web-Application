import {
  diffFilters,
  getDefaultChildSubjectForYearGroup,
  getDefaultFilter,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
  getFilterData,
  getNumberOfFiltersApplied,
  isHighlightedUnit,
} from "./filtering";
import { CurriculumFilters, Unit } from "./types";

import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumUnitsYearData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createTier } from "@/fixtures/curriculum/tier";
import { createThread } from "@/fixtures/curriculum/thread";

describe("filtering", () => {
  describe("getDefaultChildSubjectForYearGroup", () => {
    it("with data", () => {
      const childSubjectPhysics = createChildSubject({
        subject_slug: "physics",
      });
      const childSubjectBiology = createChildSubject({
        subject_slug: "biology",
      });

      const input = {
        "7": {
          units: [
            createUnit({
              slug: "test1",
              subject_slug: childSubjectPhysics.subject_slug,
            }),
          ],
          childSubjects: [childSubjectPhysics],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
        "8": {
          units: [
            createUnit({
              slug: "test2",
              subject_slug: childSubjectBiology.subject_slug,
            }),
          ],
          childSubjects: [childSubjectBiology],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
      };
      const out = getDefaultChildSubjectForYearGroup(input);
      expect(out).toEqual(["biology"]);
    });

    it("without data", () => {
      const input: CurriculumUnitsYearData = {
        "7": {
          units: [createUnit({ slug: "test1" })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
        "8": {
          units: [createUnit({ slug: "test2" })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
      };
      const out = getDefaultChildSubjectForYearGroup(input);
      expect(out).toEqual([]);
    });
  });

  describe("getDefaultSubjectCategoriesForYearGroup", () => {
    it("with data", () => {
      const subCat1 = createSubjectCategory({ id: 1 });
      const subCat2 = createSubjectCategory({ id: 2 });
      const input: CurriculumUnitsYearData = {
        "7": {
          units: [createUnit({ slug: "test1", subjectcategories: [subCat1] })],
          childSubjects: [],
          subjectCategories: [subCat1],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
        "8": {
          units: [createUnit({ slug: "test1", subjectcategories: [subCat2] })],
          childSubjects: [],
          subjectCategories: [subCat2],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
      };
      const out = getDefaultSubjectCategoriesForYearGroup(input);
      expect(out).toEqual(["1"]);
    });

    it("without data", () => {
      const input: CurriculumUnitsYearData = {
        "7": {
          units: [createUnit({ slug: "test1", subjectcategories: [] })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
        "8": {
          units: [createUnit({ slug: "test1", subjectcategories: [] })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
      };
      const out = getDefaultSubjectCategoriesForYearGroup(input);
      expect(out).toEqual([]);
    });
  });

  describe("getDefaultTiersForYearGroup", () => {
    it("with data", () => {
      const foundationTier = createTier({ tier_slug: "foundation" });
      const higherTier = createTier({ tier_slug: "higher" });
      const input: CurriculumUnitsYearData = {
        "7": {
          units: [
            createUnit({ slug: "test1", tier_slug: higherTier.tier_slug }),
          ],
          childSubjects: [],
          subjectCategories: [],
          tiers: [higherTier],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
        "8": {
          units: [
            createUnit({ slug: "test2", tier_slug: foundationTier.tier_slug }),
          ],
          childSubjects: [],
          subjectCategories: [],
          tiers: [foundationTier],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        } as CurriculumUnitsYearData[number],
      };
      const out = getDefaultTiersForYearGroup(input);
      expect(out).toEqual(["foundation"]);
    });

    it("without data", () => {
      const input: CurriculumUnitsYearData = {
        "7": {
          units: [createUnit({ slug: "test1", tier_slug: undefined })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        },
        "8": {
          units: [createUnit({ slug: "test2", tier_slug: undefined })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
        } as CurriculumUnitsYearData[number],
      };
      const out = getDefaultTiersForYearGroup(input);
      expect(out).toEqual([]);
    });
  });

  it("isHighlightedUnit", () => {
    const thread1 = createThread({ slug: "thread1" });
    const thread2 = createThread({ slug: "thread2" });
    const thread3 = createThread({ slug: "thread3" });
    const thread4 = createThread({ slug: "thread4" });
    const unit = createUnit({
      slug: "test1",
      threads: [thread1, thread2, thread3],
    });
    expect(isHighlightedUnit(unit, [thread1.slug])).toBeTruthy();
    expect(isHighlightedUnit(unit, [thread4.slug])).toBeFalsy();
    expect(isHighlightedUnit(unit, [])).toBeFalsy();
    expect(isHighlightedUnit(unit, null)).toBeFalsy();
  });

  describe("getDefaultFilter", () => {
    it("with data", () => {
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

    it("without data", () => {});
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

describe("diffFilters", () => {
  it("no filters applied", () => {
    const dfltFilter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    };
    expect(diffFilters(dfltFilter, dfltFilter)).toEqual({
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    });
  });

  it("with filters applied", () => {
    const subCat = createSubjectCategory({ id: 2 });
    const tierHigher = createTier({ tier_slug: "higher" });
    const thread = createThread({ slug: "thread2" });
    const dfltFilter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    };
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [String(subCat.id)],
      tiers: [tierHigher.tier_slug],
      years: [],
      threads: [thread.slug],
    };
    expect(diffFilters(dfltFilter, filter)).toEqual({
      childSubjects: [],
      subjectCategories: [String(subCat.id)],
      tiers: [tierHigher.tier_slug],
      years: [],
      threads: [thread.slug],
    });
  });
});

describe("getNumberOfFiltersApplied", () => {
  it("no filters applied", () => {
    const dfltFilter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    };
    expect(getNumberOfFiltersApplied(dfltFilter, dfltFilter)).toEqual(0);
  });

  it("with filters applied", () => {
    const subCat = createSubjectCategory({ id: 2 });
    const tierHigher = createTier({ tier_slug: "higher" });
    const thread = createThread({ slug: "thread2" });
    const dfltFilter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    };
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [String(subCat.id)],
      tiers: [tierHigher.tier_slug],
      years: [],
      threads: [thread.slug],
    };
    expect(getNumberOfFiltersApplied(dfltFilter, filter)).toEqual(3);
  });
});
