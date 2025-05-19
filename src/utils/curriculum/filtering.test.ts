import { useSearchParams } from "next/navigation";
import { renderHook } from "@testing-library/react";

import {
  buildTextDescribingFilter,
  childSubjectForFilter,
  diffFilters,
  filteringFromYears,
  filtersToQuery,
  getDefaultChildSubjectForYearGroup,
  getDefaultFilter,
  getDefaultSubjectCategoriesForYearGroup,
  getDefaultTiersForYearGroup,
  getFilterData,
  getNumberOfFiltersApplied,
  getNumberOfSelectedUnits,
  highlightedUnitCount,
  isHighlightedUnit,
  mergeInFilterParams,
  shouldDisplayFilter,
  subjectCategoryForFilter,
  threadForFilter,
  tierForFilter,
  useFilters,
} from "./filtering";
import { CurriculumFilters, YearData, Unit } from "./types";
import { isCurricRoutingEnabled } from "./flags";

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

const replaceMock = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    replace: (...args: []) => replaceMock(...args),
  }),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("./flags", () => ({
  isCurricRoutingEnabled: jest.fn(() => false),
}));

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
        pathways: [],
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
      pathways: [],
    };
    expect(diffFilters(dfltFilter, dfltFilter)).toEqual({
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      years: [],
      threads: [],
      pathways: [],
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
      pathways: [],
    };
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [String(subCat.id)],
      tiers: [tierHigher.tier_slug],
      years: [],
      threads: [thread.slug],
      pathways: [],
    };
    expect(diffFilters(dfltFilter, filter)).toEqual({
      childSubjects: [],
      subjectCategories: [String(subCat.id)],
      tiers: [tierHigher.tier_slug],
      years: [],
      threads: [thread.slug],
      pathways: [],
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
      pathways: [],
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
      pathways: [],
    };
    const filter: CurriculumFilters = {
      childSubjects: [],
      subjectCategories: [String(subCat.id)],
      tiers: [tierHigher.tier_slug],
      years: [],
      threads: [thread.slug],
      pathways: [],
    };
    expect(getNumberOfFiltersApplied(dfltFilter, filter)).toEqual(3);
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
    });
  });
});

describe("useFilters", () => {
  describe("without routing", () => {
    it("initial state", () => {
      const defaultFilter = createFilter();
      const { result } = renderHook(() => {
        return useFilters(defaultFilter);
      });
      const [filters] = result.current;
      expect(filters).toEqual(defaultFilter);
    });

    it("updating state", () => {
      const defaultFilter = createFilter();
      const updateFilterValue = createFilter({});
      const { result, rerender } = renderHook(() => {
        return useFilters(defaultFilter);
      });

      const [, setFilters] = result.current;
      setFilters(updateFilterValue);
      rerender();
      const [filters] = result.current;
      expect(filters).toEqual(updateFilterValue);
    });
  });

  describe("with routing", () => {
    it("initial state", () => {
      (isCurricRoutingEnabled as jest.Mock).mockReturnValue(true);
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams("?tiers=foundation"),
      );

      const defaultFilter = createFilter();
      const { result } = renderHook(() => {
        return useFilters(defaultFilter);
      });
      const [filters] = result.current;
      expect(filters).toEqual({
        ...defaultFilter,
        tiers: ["foundation"],
      });
    });

    it("updating state", () => {
      (isCurricRoutingEnabled as jest.Mock).mockReturnValue(true);

      const defaultFilter = createFilter();
      const updateFilterValue = createFilter({
        tiers: ["foundation"],
      });
      const { result, rerender } = renderHook(() => {
        return useFilters(defaultFilter);
      });

      const [, setFilters] = result.current;
      setFilters(updateFilterValue);

      expect(replaceMock).toHaveBeenCalledWith(
        "/?tiers=foundation",
        undefined,
        {
          scroll: false,
          shallow: true,
        },
      );

      rerender();
      const [filters] = result.current;
      expect(filters).toEqual(updateFilterValue);
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
  const subCat1 = createSubjectCategory({ id: 1 });
  const subCat2 = createSubjectCategory({ id: 2 });
  const subCat3 = createSubjectCategory({ id: 3 });
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
      },
    },
    yearOptions: ["7"],
    threadOptions: [thread1, thread2, thread3],
  };
  it("subjectCategoryForFilter", () => {
    const result = subjectCategoryForFilter(
      data,
      createFilter({
        subjectCategories: [String(subCat2.id)],
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
  it("tierForFilter", () => {
    const result = tierForFilter(
      data,
      createFilter({
        tiers: [tier2.tier_slug],
      }),
    );
    expect(result).toEqual(tier2);
  });
  it("threadForFilter", () => {
    const result = threadForFilter(
      data,
      createFilter({
        threads: [thread2.slug],
      }),
    );
    expect(result).toEqual(thread2);
  });
});

describe("buildTextDescribingFilter", () => {
  const subCat1 = createSubjectCategory({ id: 1, title: "SubjectCategory1" });
  const childSubject1 = createChildSubject({ subject_slug: "ChildSubject1" });
  const tier1 = createTier({ tier_slug: "tier1" });
  const thread1 = createThread({ slug: "thread1" });
  const year7Data: CurriculumUnitsFormattedData = {
    yearData: {
      "7": {
        units: [],
        childSubjects: [childSubject1],
        subjectCategories: [subCat1],
        tiers: [tier1],
        pathways: [],
        isSwimming: false,
        groupAs: null,
      },
    },
    yearOptions: ["7"],
    threadOptions: [thread1],
  };

  const year11Data: CurriculumUnitsFormattedData = {
    yearData: {
      "11": {
        units: [],
        childSubjects: [],
        subjectCategories: [subCat1],
        tiers: [tier1],
        pathways: [],
        isSwimming: false,
        groupAs: null,
      },
    },
    yearOptions: ["7"],
    threadOptions: [thread1],
  };

  const year11DataWithChildSubject: CurriculumUnitsFormattedData = {
    yearData: {
      "11": {
        units: [],
        childSubjects: [childSubject1],
        subjectCategories: [],
        tiers: [tier1],
        pathways: [],
        isSwimming: false,
        groupAs: null,
      },
    },
    yearOptions: ["7"],
    threadOptions: [thread1],
  };

  const primaryData: CurriculumUnitsFormattedData = {
    yearData: {
      "1": {
        units: [],
        childSubjects: [],
        subjectCategories: [subCat1],
        tiers: [tier1],
        pathways: [],
        isSwimming: false,
        groupAs: null,
      },
      "6": {
        units: [],
        childSubjects: [],
        subjectCategories: [subCat1],
        tiers: [tier1],
        pathways: [],
        isSwimming: false,
        groupAs: null,
      },
    },
    yearOptions: ["7"],
    threadOptions: [thread1],
  };

  it("subjectCategory (KS3)", () => {
    const result = buildTextDescribingFilter(
      year7Data,
      createFilter({ subjectCategories: [String(subCat1.id)] }),
    );
    expect(result).toEqual(["SubjectCategory1 (KS3)"]);
  });

  it("subjectCategory (KS4)", () => {
    const result = buildTextDescribingFilter(
      year11Data,
      createFilter({ subjectCategories: [String(subCat1.id)] }),
    );
    expect(result).toEqual(["SubjectCategory1 (KS4)"]);
  });

  it("subjectCategory (KS1 & KS2)", () => {
    const result = buildTextDescribingFilter(
      primaryData,
      createFilter({ subjectCategories: [String(subCat1.id)] }),
    );
    expect(result).toEqual(["SubjectCategory1"]);
  });

  it("childSubject", () => {
    const result = buildTextDescribingFilter(
      year11DataWithChildSubject,
      createFilter({ childSubjects: [childSubject1.subject_slug] }),
    );
    expect(result).toEqual(["ChildSubject1 (KS4)"]);
  });

  it("tier", () => {
    const result = buildTextDescribingFilter(
      year11Data,
      createFilter({ tiers: [tier1.tier_slug] }),
    );
    expect(result).toEqual(["Tier1 (KS4)"]);
  });

  it("thread", () => {
    const result = buildTextDescribingFilter(
      year7Data,
      createFilter({ threads: [thread1.slug] }),
    );
    expect(result).toEqual(["Thread1"]);
  });

  it("all", () => {
    const result = buildTextDescribingFilter(
      year7Data,
      createFilter({
        subjectCategories: [String(subCat1.id)],
        childSubjects: [childSubject1.subject_slug],
        tiers: [tier1.tier_slug],
        threads: [thread1.slug],
      }),
    );
    expect(result).toEqual([
      "SubjectCategory1 (KS3)",
      "ChildSubject1 (KS3)",
      "Tier1 (KS3)",
      "Thread1",
    ]);
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
