import {
  getProgrammeFactors,
  isCurrentPageItems,
  isUnitListData,
  isUnitOption,
} from "./helpers";

import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";

describe("unit list helpers", () => {
  test("isUnitOption determines if the item is a unit option", () => {
    const result = isUnitOption([
      {
        programmeSlug: "biology-secondary-ks4",
        slug: "unit-1",
        title: "Unit 1",
        lessonCount: 3,
        subjectSlug: "biology",
        subjectTitle: "Biology",
        nullTitle: "Unit 1",
        expired: false,
        expiredLessonCount: 0,
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        yearOrder: 1,
        year: "year-1",
        yearTitle: "Year 1",
        learningThemes: [],
        unpublishedLessonCount: 0,
      },
    ]);
    expect(result).toEqual(true);
  });
  test("isUnitListData determines if the data is unit list", () => {
    const result = isUnitListData({
      programmeSlug: "biology-secondary-ks4",
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
      examBoardSlug: "aqa",
      examBoardTitle: "AQA",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      pathwayTitle: null,
      subjectParent: null,
      tierSlug: "higher",
      tiers: [],
      units: [],
      phase: "secondary",
      learningThemes: [],
      hasNewContent: false,
      yearGroups: [{ year: "year-1", yearTitle: "Year 1" }],
      subjectCategories: [
        { label: "Biology", slug: "biology", iconName: "icon-biology" },
      ],
    });
    expect(result).toEqual(true);
  });
  test("isCurrentPageItems determines if the data is current page items", () => {
    const result = isCurrentPageItems([
      [
        {
          programmeSlug: "biology-secondary-ks4",
          slug: "unit-1",
          title: "Unit 1",
          lessonCount: 3,
          subjectSlug: "biology",
          subjectTitle: "Biology",
          nullTitle: "Unit 1",
          expired: false,
          expiredLessonCount: 0,
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          yearOrder: 1,
          year: "year-1",
          yearTitle: "Year 1",
          learningThemes: [],
          unpublishedLessonCount: 0,
        },
      ],
    ]);
    expect(result).toEqual(true);
  });
  test("getProgrammeFactors returns the correct factors for unit data", () => {
    const result = getProgrammeFactors({
      programmeSlug: "biology-secondary-ks4",
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
      examBoardSlug: "aqa",
      examBoardTitle: "AQA",
      subjectSlug: "biology",
      subjectTitle: "Biology",
      pathwayTitle: null,
      subjectParent: "Science",
      tierSlug: "higher",
      tiers: [],
      units: [],
      phase: "secondary",
      learningThemes: [],
      hasNewContent: false,
      currentPageItems: [],
      yearGroups: [{ year: "year-10", yearTitle: "Year 10" }],
      subjectCategories: [
        { label: "Biology", slug: "biology", iconName: "icon-biology" },
      ],
      paginationProps: mockPaginationProps,
      onClick: () => {},
    });
    expect(result).toEqual({
      phaseSlug: "secondary",
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
      examBoardSlug: "aqa",
    });
  });
  test("getProgrammeFactors returns the correct factors for specialist unit data", () => {
    const result = getProgrammeFactors({
      programmeSlug: "numeracy-applying-learning",
      developmentStage: [
        {
          slug: "applying-learning",
          title: "Applying Learning",
          unitCount: 0,
          lessonCount: 0,
          programmeSlug: "numeracy-applying-learning",
        },
      ],
      developmentStageSlug: "applying-learning",
      subjectSlug: "numeracy",
      subjectTitle: "Numeracy",
      units: [],
      learningThemes: [],
      subjectParent: null,
      hasNewContent: false,
      currentPageItems: [],
      paginationProps: mockPaginationProps,
      yearGroups: [{ year: "year-10", yearTitle: "Year 10" }],
      onClick: () => {},
    });
    expect(result).toEqual({
      phase: undefined,
      examBoardSlug: undefined,
      keyStageSlug: undefined,
    });
  });
});
