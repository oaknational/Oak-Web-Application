import { ReadonlyURLSearchParams } from "next/navigation";

import {
  diffFilters,
  filtersToQuery,
  getDefaultChildSubjectForYearGroup,
  getDefaultFilter,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
  getFilterData,
  getNumberOfFiltersApplied,
  isHighlightedUnit,
  mergeInFilterParams,
  shouldDisplayFilter,
} from "./filtering";
import { CurriculumFilters, Unit } from "./types";

import { createUnit } from "@/fixtures/curriculum/unit";
import {
  CurriculumUnitsFormattedData,
  CurriculumUnitsYearData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createTier } from "@/fixtures/curriculum/tier";
import { createThread } from "@/fixtures/curriculum/thread";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";

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

describe("shouldDisplayFilter", () => {
  describe("years", () => {
    it("with data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test2" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "years",
      );
      expect(result).toEqual(true);
    });

    it("no data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {},
        threadOptions: [],
        yearOptions: [],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: [] }),
        "years",
      );
      expect(result).toEqual(false);
    });
  });

  describe("subjectCategories", () => {
    it("with data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
            subjectCategories: [createSubjectCategory({ id: 1 })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test2" })],
            subjectCategories: [createSubjectCategory({ id: 1 })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "subjectCategories",
      );
      expect(result).toEqual(true);
    });

    it("no data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "subjectCategories",
      );
      expect(result).toEqual(false);
    });
  });

  describe("childSubjects", () => {
    it("with data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
            childSubjects: [createChildSubject({ subject_slug: "physics" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test2" })],
            childSubjects: [createChildSubject({ subject_slug: "biology" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "childSubjects",
      );
      expect(result).toEqual(true);
    });

    it("no data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "childSubjects",
      );
      expect(result).toEqual(false);
    });
  });

  describe("tiers", () => {
    it("with data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
            tiers: [createTier({ tier_slug: "foundation" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test2" })],
            tiers: [createTier({ tier_slug: "higher" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "tiers",
      );
      expect(result).toEqual(true);
    });

    it("no data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "tiers",
      );
      expect(result).toEqual(false);
    });
  });

  describe("threads", () => {
    it("with data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
        },
        threadOptions: [
          createThread({ slug: "test1" }),
          createThread({ slug: "test2" }),
        ],
        yearOptions: ["7", "8"],
      };

      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "threads",
      );
      expect(result).toEqual(true);
    });

    it("no data", () => {
      const data: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
          "8": createYearData({
            units: [createUnit({ slug: "test1" })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "threads",
      );
      expect(result).toEqual(false);
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

describe("filtersToQuery", () => {
  it("with default", () => {
    const result = filtersToQuery(createFilter());
    expect(result).toEqual({});
  });

  it("with data", () => {
    const childSubject1 = createChildSubject({
      subject_slug: "child_subject_1",
    });
    const childSubject2 = createChildSubject({
      subject_slug: "child_subject_2",
    });
    const subCat1 = createSubjectCategory({ id: 1 });
    const subCat2 = createSubjectCategory({ id: 2 });
    const tier1 = createTier({ tier_slug: "tier_1" });
    const tier2 = createTier({ tier_slug: "tier_2" });
    const thread1 = createThread({ slug: "thread_1" });
    const thread2 = createThread({ slug: "thread_2" });

    const result = filtersToQuery(
      createFilter({
        childSubjects: [childSubject1.subject_slug, childSubject2.subject_slug],
        subjectCategories: [String(subCat1.id), String(subCat2.id)],
        tiers: [tier1.tier_slug, tier2.tier_slug],
        years: ["7", "8"],
        threads: [thread1.slug, thread2.slug],
      }),
    );

    expect(result).toEqual({
      childSubjects: "child_subject_1,child_subject_2",
      subjectCategories: "1,2",
      threads: "thread_1,thread_2",
      tiers: "tier_1,tier_2",
      years: "7,8",
    });
  });
});

describe("mergeInFilterParams", () => {
  it("single value", () => {
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    };

    const result = mergeInFilterParams(
      filter,
      new ReadonlyURLSearchParams(
        "?childSubjects=child_subject_1&subjectCategories=1&tiers=tier_1&years=1&threads=thread1",
      ),
    );
    expect(result).toEqual({
      childSubjects: ["child_subject_1"],
      subjectCategories: ["1"],
      tiers: ["tier_1"],
      years: ["1"],
      threads: ["thread1"],
    });
  });

  it("list of values", () => {
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
    };

    const result = mergeInFilterParams(
      filter,
      new ReadonlyURLSearchParams(
        "?childSubjects=child_subject_1,child_subject_2&subjectCategories=1,2&tiers=tier_1,tier_2&years=1,2&threads=thread1,thread2",
      ),
    );
    expect(result).toEqual({
      childSubjects: ["child_subject_1", "child_subject_2"],
      subjectCategories: ["1", "2"],
      tiers: ["tier_1", "tier_2"],
      years: ["1", "2"],
      threads: ["thread1", "thread2"],
    });
  });
});
