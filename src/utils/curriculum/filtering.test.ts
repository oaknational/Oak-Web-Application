import {
  childSubjectForFilter,
  filteringFromYears,
  filtersToQuery,
  getDefaultChildSubjectForYearGroup,
  getDefaultFilter,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
  getFilterData,
  getNumberOfSelectedUnits,
  highlightedUnitCount,
  isHighlightedUnit,
  mergeInFilterParams,
  shouldDisplayFilter,
  subjectCategoryForFilter,
  scopeYearsToKeystageFilter,
} from "./filtering";
import { CurriculumFilters, YearData, Unit } from "./types";

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
          nationalCurriculum: [],
          keystage: "ks3",
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
          nationalCurriculum: [],
          keystage: "ks3",
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
          nationalCurriculum: [],
          keystage: "ks3",
        },
        "8": {
          units: [createUnit({ slug: "test2" })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
          nationalCurriculum: [],
          keystage: "ks3",
        },
      };
      const out = getDefaultChildSubjectForYearGroup(input);
      expect(out).toEqual([]);
    });
  });

  describe("getDefaultSubjectCategoriesForYearGroup", () => {
    it("with data", () => {
      const subCat1 = createSubjectCategory({ id: 1, slug: "one" });
      const subCat2 = createSubjectCategory({ id: 2, slug: "two" });
      const input: CurriculumUnitsYearData = {
        "7": {
          units: [createUnit({ slug: "test1", subjectcategories: [subCat1] })],
          childSubjects: [],
          subjectCategories: [subCat1],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
          nationalCurriculum: [],
          keystage: "ks3",
        },
        "8": {
          units: [createUnit({ slug: "test1", subjectcategories: [subCat2] })],
          childSubjects: [],
          subjectCategories: [subCat2],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
          nationalCurriculum: [],
          keystage: "ks3",
        },
      };
      const out = getDefaultSubjectCategoriesForYearGroup(input);
      expect(out).toEqual(["one"]);
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
          nationalCurriculum: [],
          keystage: "ks3",
        },
        "8": {
          units: [createUnit({ slug: "test1", subjectcategories: [] })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
          nationalCurriculum: [],
          keystage: "ks3",
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
          nationalCurriculum: [],
          keystage: "ks3",
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
          nationalCurriculum: [],
          keystage: "ks3",
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
          nationalCurriculum: [],
          keystage: "ks3",
        },
        "8": {
          units: [createUnit({ slug: "test2", tier_slug: undefined })],
          childSubjects: [],
          subjectCategories: [],
          tiers: [],
          pathways: [],
          isSwimming: false,
          groupAs: null,
          nationalCurriculum: [],
          keystage: "ks3",
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
            subjectCategories: [
              createSubjectCategory({ id: 2, slug: "sub-cat-2" }),
            ],
          } as CurriculumUnitsYearData[number],
          "8": {
            units: [] as Unit[],
            tiers: [{ tier_slug: "higher", tier: "Higher" }],
            childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
            subjectCategories: [
              createSubjectCategory({ id: 1, slug: "sub-cat-1" }),
            ],
          } as CurriculumUnitsYearData[number],
        },
        threadOptions: [],
        yearOptions: ["7", "8"],
        keystages: [],
      });
      expect(out).toEqual({
        childSubjects: ["biology"],
        subjectCategories: ["sub-cat-1"],
        threads: [],
        tiers: ["foundation"],
        years: ["7", "8"],
        pathways: [],
        keystages: [],
      });
    });
  });
});

test("getFilterData", () => {
  const definition = {
    "7": {
      units: [] as Unit[],
      tiers: [{ tier_slug: "foundation", tier: "Foundation" }],
      childSubjects: [{ subject: "Physics", subject_slug: "physics" }],
      subjectCategories: [createSubjectCategory({ id: 2, slug: "sub-cat-2" })],
    } as CurriculumUnitsYearData[number],
    "8": {
      units: [] as Unit[],
      tiers: [{ tier_slug: "higher", tier: "Higher" }],
      childSubjects: [{ subject: "Biology", subject_slug: "biology" }],
      subjectCategories: [createSubjectCategory({ id: 1, slug: "sub-cat-1" })],
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
        slug: "sub-cat-1",
        title: "Foo",
      },
      {
        id: 2,
        slug: "sub-cat-2",
        title: "Foo",
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
        slug: "sub-cat-2",
        title: "Foo",
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
        slug: "sub-cat-1",
        title: "Foo",
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

describe("scopeYearsToKeystageFilter", () => {
  it("returns all years when no keystage filter is active", () => {
    const filters = createFilter({
      years: ["7", "8", "9", "10", "11"],
      keystages: [],
    });
    expect(scopeYearsToKeystageFilter(filters)).toEqual([
      "7",
      "8",
      "9",
      "10",
      "11",
    ]);
  });

  it("narrows to KS4 years when keystage filter is ks4 and all years selected", () => {
    const filters = createFilter({
      years: ["7", "8", "9", "10", "11"],
      keystages: ["ks4"],
    });
    expect(scopeYearsToKeystageFilter(filters)).toEqual(["10", "11"]);
  });

  it("returns selected year only when a single year is selected", () => {
    const filters = createFilter({
      years: ["10"],
      keystages: ["ks4"],
    });
    expect(scopeYearsToKeystageFilter(filters)).toEqual(["10"]);
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
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
        keystages: [],
      };
      const result = shouldDisplayFilter(
        data,
        createFilter({ years: ["7", "8"] }),
        "threads",
      );
      expect(result).toEqual(false);
    });
  });

  // Science secondary: KS3 has subject categories, KS4 has child subjects (exam
  // subjects). When a keystage filter is active the sidebar should only show
  // filters relevant to that keystage.
  describe("keystage scoping", () => {
    const scienceSecondaryData: CurriculumUnitsFormattedData = {
      yearData: {
        // KS3 years: subject categories, no child subjects
        "7": createYearData({
          units: [createUnit({ slug: "y7" })],
          subjectCategories: [createSubjectCategory({ id: 1 })],
        }),
        "8": createYearData({
          units: [createUnit({ slug: "y8" })],
          subjectCategories: [createSubjectCategory({ id: 1 })],
        }),
        "9": createYearData({
          units: [createUnit({ slug: "y9" })],
          subjectCategories: [createSubjectCategory({ id: 1 })],
        }),
        // KS4 years: child subjects (>1 required for byKeyStageSlug to expose
        // them), no meaningful categories (stripped by byKeyStageSlug)
        "10": createYearData({
          units: [createUnit({ slug: "y10" })],
          childSubjects: [
            createChildSubject({ subject_slug: "physics" }),
            createChildSubject({ subject_slug: "biology" }),
          ],
          tiers: [
            createTier({ tier_slug: "foundation" }),
            createTier({ tier_slug: "higher" }),
          ],
        }),
        "11": createYearData({
          units: [createUnit({ slug: "y11" })],
          childSubjects: [
            createChildSubject({ subject_slug: "physics" }),
            createChildSubject({ subject_slug: "biology" }),
          ],
          tiers: [
            createTier({ tier_slug: "foundation" }),
            createTier({ tier_slug: "higher" }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["7", "8", "9", "10", "11"],
      keystages: [],
    };

    it("Science KS3 view: shows subject categories, hides child subjects and tiers", () => {
      const filters = createFilter({
        years: ["7", "8", "9", "10", "11"],
        keystages: ["ks3"],
      });
      expect(
        shouldDisplayFilter(scienceSecondaryData, filters, "subjectCategories"),
      ).toEqual(true);
      expect(
        shouldDisplayFilter(scienceSecondaryData, filters, "childSubjects"),
      ).toEqual(false);
      expect(
        shouldDisplayFilter(scienceSecondaryData, filters, "tiers"),
      ).toEqual(false);
    });

    it("Science KS4 view: shows child subjects and tiers, hides subject categories", () => {
      const filters = createFilter({
        years: ["7", "8", "9", "10", "11"],
        keystages: ["ks4"],
      });
      expect(
        shouldDisplayFilter(scienceSecondaryData, filters, "subjectCategories"),
      ).toEqual(false);
      expect(
        shouldDisplayFilter(scienceSecondaryData, filters, "childSubjects"),
      ).toEqual(true);
      expect(
        shouldDisplayFilter(scienceSecondaryData, filters, "tiers"),
      ).toEqual(true);
    });

    // English secondary: KS3 units have no categories; KS4 has categories.
    // Without keystage scoping, the KS4 categories would bleed into a KS3 view.
    it("English KS3 view: hides subject categories when KS3 has none (no bleed from KS4)", () => {
      const englishSecondaryData: CurriculumUnitsFormattedData = {
        yearData: {
          "7": createYearData({ units: [createUnit({ slug: "y7" })] }),
          "8": createYearData({ units: [createUnit({ slug: "y8" })] }),
          "9": createYearData({ units: [createUnit({ slug: "y9" })] }),
          "10": createYearData({
            units: [createUnit({ slug: "y10" })],
            subjectCategories: [createSubjectCategory({ id: 2 })],
          }),
          "11": createYearData({
            units: [createUnit({ slug: "y11" })],
            subjectCategories: [createSubjectCategory({ id: 2 })],
          }),
        },
        threadOptions: [],
        yearOptions: ["7", "8", "9", "10", "11"],
        keystages: [],
      };

      const filters = createFilter({
        years: ["7", "8", "9", "10", "11"],
        keystages: ["ks3"],
      });
      expect(
        shouldDisplayFilter(englishSecondaryData, filters, "subjectCategories"),
      ).toEqual(false);
    });
  });
});

describe("filtersToQuery", () => {
  it("with default", () => {
    const result = filtersToQuery(createFilter(), {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    });
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
      {
        childSubjects: [],
        subjectCategories: [],
        tiers: [],
        years: [],
        threads: [],
        pathways: [],
        keystages: [],
      },
    );

    expect(result).toEqual({
      child_subjects: "child_subject_1,child_subject_2",
      subject_categories: "1,2",
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
      pathways: [],
      keystages: [],
    };

    const result = mergeInFilterParams(
      filter,
      new URLSearchParams(
        "?child_subjects=child_subject_1&subject_categories=1&tiers=tier_1&years=1&threads=thread1",
      ),
    );
    expect(result).toEqual({
      childSubjects: ["child_subject_1"],
      subjectCategories: ["1"],
      tiers: ["tier_1"],
      years: ["1"],
      threads: ["thread1"],
      pathways: [],
      keystages: [],
    });
  });

  it("list of values", () => {
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
      keystages: [],
    };

    const result = mergeInFilterParams(
      filter,
      new URLSearchParams(
        "?child_subjects=child_subject_1,child_subject_2&subject_categories=1,2&tiers=tier_1,tier_2&years=1,2&threads=thread1,thread2",
      ),
    );
    expect(result).toEqual({
      childSubjects: ["child_subject_1", "child_subject_2"],
      subjectCategories: ["1", "2"],
      tiers: ["tier_1", "tier_2"],
      years: ["1", "2"],
      threads: ["thread1", "thread2"],
      pathways: [],
      keystages: [],
    });
  });
});

describe("highlightedUnitCount", () => {
  const thread1 = createThread({ slug: "thread1" });
  const thread2 = createThread({ slug: "thread2" });
  const thread3 = createThread({ slug: "thread3" });
  const thread4 = createThread({ slug: "thread4" });
  const filters = createFilter({
    years: ["7"],
  });
  const yearData = {
    "7": createYearData({
      units: [
        createUnit({ threads: [thread1] }),
        createUnit({ threads: [thread2] }),
        createUnit({ threads: [thread3] }),
      ],
    }),
  };

  it("no units highlighted", () => {
    const result = highlightedUnitCount(yearData, filters, [thread4.slug]);
    expect(result).toEqual(0);
  });

  it("many units highlighted", () => {
    const result = highlightedUnitCount(yearData, filters, [
      thread1.slug,
      thread3.slug,
    ]);
    expect(result).toEqual(2);
  });

  it("excludes units outside the active keystage", () => {
    // ks3 = years 7,8,9 — ks4 = years 10,11
    const ks3Thread = createThread({ slug: "ks3-thread" });
    const mixedYearData = {
      // year 7 is in ks3
      "7": createYearData({
        units: [
          createUnit({ threads: [ks3Thread] }),
          createUnit({ threads: [ks3Thread] }),
        ],
      }),
      // year 10 is in ks4
      "10": createYearData({
        units: [createUnit({ threads: [ks3Thread] })],
      }),
    };
    // filters.years covers all years; keystages restricts to ks4 only
    const ks4Filters = createFilter({
      years: ["7", "10"],
      keystages: ["ks4"],
      threads: [ks3Thread.slug],
    });

    const result = highlightedUnitCount(mixedYearData, ks4Filters, [
      ks3Thread.slug,
    ]);
    // Only the 1 unit in year 10 (ks4) should be counted, not the 2 in year 7
    expect(result).toEqual(1);
  });
});

describe("filteringFromYears", () => {
  const tierHigher = createTier({ tier_slug: "higher" });
  const subCat1 = createSubjectCategory({ id: 1 });
  const childSubject = createChildSubject({ subject_slug: "biology" });

  it("no filters", () => {
    const result = filteringFromYears(
      createYearData({
        tiers: [tierHigher],
        subjectCategories: [subCat1],
      }),
      createFilter(),
    );
    expect(result).toEqual({
      childSubjects: undefined,
      subjectCategories: [],
      threads: [],
      tiers: [],
      years: [],
      pathways: [],
      keystages: [],
    });
  });

  it("without tiers", () => {
    const filter = createFilter({
      tiers: [tierHigher.tier_slug],
      childSubjects: [childSubject.subject_slug],
    });
    const result = filteringFromYears(
      createYearData({
        childSubjects: [childSubject],
      }),
      filter,
    );
    expect(result).toEqual({
      ...filter,
      tiers: undefined,
      subjectCategories: undefined,
    });
  });

  it("without child subjects", () => {
    const filter = createFilter({
      tiers: [tierHigher.tier_slug],
      childSubjects: [childSubject.subject_slug],
    });
    const result = filteringFromYears(
      createYearData({
        tiers: [tierHigher],
      }),
      filter,
    );
    expect(result).toEqual({
      ...filter,
      childSubjects: undefined,
      subjectCategories: undefined,
    });
  });

  it("without subject categories", () => {
    const filter = createFilter({
      tiers: [tierHigher.tier_slug],
      subjectCategories: [String(subCat1.id)],
    });
    const result = filteringFromYears(
      createYearData({
        tiers: [tierHigher],
      }),
      filter,
    );
    expect(result).toEqual({
      ...filter,
      childSubjects: undefined,
      subjectCategories: undefined,
    });
  });
});

describe("subjectCategoryFor*", () => {
  const subCat1 = createSubjectCategory({ slug: "sub-cat-1", id: 1 });
  const subCat2 = createSubjectCategory({ slug: "sub-cat-2", id: 2 });
  const subCat3 = createSubjectCategory({ slug: "sub-cat-3", id: 3 });
  const childSubject1 = createChildSubject({ subject_slug: "cs1" });
  const childSubject2 = createChildSubject({ subject_slug: "cs2" });
  const childSubject3 = createChildSubject({ subject_slug: "cs3" });
  const tier1 = createTier({ tier_slug: "tier1" });
  const tier2 = createTier({ tier_slug: "tier2" });
  const tier3 = createTier({ tier_slug: "tier3" });
  const thread1 = createThread({ slug: "thread1" });
  const thread2 = createThread({ slug: "thread2" });
  const thread3 = createThread({ slug: "thread3" });
  const data: CurriculumUnitsFormattedData = {
    yearData: {
      "7": {
        units: [],
        childSubjects: [childSubject1, childSubject2, childSubject3],
        subjectCategories: [subCat1, subCat2, subCat3],
        tiers: [tier1, tier2, tier3],
        pathways: [],
        isSwimming: false,
        groupAs: null,
        nationalCurriculum: [],
        keystage: "ks3",
      },
    },
    yearOptions: ["7"],
    threadOptions: [thread1, thread2, thread3],
    keystages: [],
  };
  it("subjectCategoryForFilter", () => {
    const result = subjectCategoryForFilter(
      data,
      createFilter({
        subjectCategories: [subCat2.slug],
      }),
    );
    expect(result).toEqual(subCat2);
  });
  it("childSubjectForFilter", () => {
    const result = childSubjectForFilter(
      data,
      createFilter({
        childSubjects: [childSubject2.subject_slug],
      }),
    );
    expect(result).toEqual(childSubject2);
  });
});

describe("getNumberOfSelectedUnits", () => {
  const foundationTier = createTier({ tier_slug: "foundation" });
  const higherTier = createTier({ tier_slug: "higher" });
  const yearData: YearData = {
    "7": {
      units: [
        createUnit({ slug: "unit1", tier_slug: foundationTier.tier_slug }),
        createUnit({ slug: "unit2", tier_slug: foundationTier.tier_slug }),
      ],
      childSubjects: [],
      tiers: [foundationTier],
      subjectCategories: [],
      isSwimming: false,
      groupAs: null,
      pathways: [],
      nationalCurriculum: [],
      keystage: "ks3",
    },
    "8": {
      units: [
        createUnit({ slug: "unit3", tier_slug: foundationTier.tier_slug }),
        createUnit({ slug: "unit4", tier_slug: higherTier.tier_slug }),
        createUnit({ slug: "unit5", tier_slug: higherTier.tier_slug }),
      ],
      childSubjects: [],
      tiers: [foundationTier, higherTier],
      subjectCategories: [],
      isSwimming: false,
      groupAs: null,
      pathways: [],
      nationalCurriculum: [],
      keystage: "ks3",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 0 when yearData is empty", () => {
    const result = getNumberOfSelectedUnits(
      {},
      createFilter({
        years: [],
        threads: [],
      }),
    );
    expect(result).toBe(0);
  });

  it("should count visible units for all years when selectedYear is All", () => {
    const yearSelection = createFilter({
      years: ["7", "8"],
      threads: [],
    });

    const result = getNumberOfSelectedUnits(yearData, yearSelection);
    expect(result).toBe(5);
  });

  it("should count visible units only for the selected year", () => {
    const yearSelection = createFilter({
      years: ["8"],
      threads: [],
    });

    const result = getNumberOfSelectedUnits(yearData, yearSelection);
    expect(result).toBe(3);
  });

  it("should only count units that are visible", () => {
    const yearSelection = createFilter({
      years: ["7", "8"],
      tiers: ["foundation"],
    });

    const result = getNumberOfSelectedUnits(yearData, yearSelection);
    expect(result).toBe(3);
  });

  it("should return 0 when no units are visible", () => {
    const yearSelection = createFilter({
      years: ["7", "8"],
      tiers: ["foo"],
    });

    const result = getNumberOfSelectedUnits(yearData, yearSelection);
    expect(result).toBe(0);
  });
});
