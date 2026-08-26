import { screen } from "@testing-library/dom";

import { ProgrammeFilters, ProgrammeFiltersProps } from "./ProgrammeFilters";
import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { BrowseFiltersProvider } from "@/context/BrowseFilters";
import { BrowseFilters } from "@/context/BrowseFilters/types";
import { createFilter } from "@/context/BrowseFilters/utils/fixtures";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createUnit } from "@/fixtures/curriculum/unit";

/**
 * Year data spanning KS3 and KS4 so that all five filter groups can render:
 *
 *   - "Year group"    → yearOptions.length > 0
 *   - "Category"      → KS3 (year 7) has subjectCategories, no childSubjects
 *   - "Child subject" → KS4 (year 10) has ≥2 childSubjects
 *   - "Tier"          → KS4 (year 10) has tiers
 *   - "Thread"        → threadOptions.length > 0
 *
 */
export const mockProgrammeFiltersData: ProgrammePageFiltersProps["data"] = {
  yearData: {
    "7": createYearData({
      units: [createUnit({ year: "7" })],
      subjectCategories: [
        createSubjectCategory({
          slug: "language",
          title: "Language",
        }),
        createSubjectCategory({
          slug: "literature",
          title: "Literature",
        }),
      ],
      keystage: "ks3",
    }),
    "10": createYearData({
      units: [
        createUnit({ year: "10", subject_slug: "biology", tier: "foundation" }),
        createUnit({ year: "10", subject_slug: "chemistry", tier: "higher" }),
      ],
      childSubjects: [
        createChildSubject({ subject_slug: "biology" }),
        createChildSubject({ subject_slug: "chemistry" }),
      ],
      tiers: [
        { tier_slug: "foundation", tier: "Foundation" },
        { tier_slug: "higher", tier: "Higher" },
      ],
      keystage: "ks4",
    }),
  },
  threadOptions: [
    { slug: "poetry", title: "Poetry", order: 1 },
    { slug: "prose", title: "Prose", order: 2 },
  ],
  yearOptions: ["7", "8", "9", "10", "11"],
  keystages: ["ks3", "ks4"],
};

const render = renderWithProviders();

const defaultProps: ProgrammeFiltersProps = {
  data: mockProgrammeFiltersData,
  slugs: {
    subjectSlug: "english",
    phaseSlug: "secondary",
    ks4OptionSlug: null,
  },
  ks4Options: [],
  ks4OptionFilterDimensions: {},
};

const renderProgrammeFilters = (
  filters: BrowseFilters,
  props: Partial<ProgrammeFiltersProps> = {},
) => {
  return render(
    <BrowseFiltersProvider defaultFilter={filters}>
      <ProgrammeFilters {...defaultProps} {...props} />
    </BrowseFiltersProvider>,
  );
};

const examBoardKs4Options: ProgrammePageFiltersProps["ks4Options"] = [
  { slug: "aqa", title: "AQA" },
  { slug: "edexcel", title: "Edexcel" },
];
describe("Programme filters...", () => {
  test("it displays the filters in the correct order", () => {
    renderProgrammeFilters(createFilter({ years: ["7", "10"] }));

    const filterLegendNames = [
      "Key stages",
      "Year group",
      "Category (KS3)",
      "Exam subject (KS4)",
      "Learning tier (KS4)",
      "Highlight a thread",
    ];
    const filterLegends = screen.getAllByRole("group");
    filterLegends.forEach((legend, i) => {
      expect(legend).toHaveAccessibleName(filterLegendNames[i]);
    });
  });

  test("it displays the exam board filter after year group when in KS4 context", () => {
    renderProgrammeFilters(
      createFilter({ years: ["10"], keystages: ["ks4"] }),
      {
        slugs: {
          subjectSlug: "english",
          phaseSlug: "secondary",
          ks4OptionSlug: "aqa",
        },
        ks4Options: examBoardKs4Options,
      },
    );

    const filterLegends = screen.getAllByRole("group");
    expect(filterLegends[0]).toHaveAccessibleName("Key stages");
    expect(filterLegends[1]).toHaveAccessibleName("Year group");
    expect(filterLegends[2]).toHaveAccessibleName("Exam board (KS4)");
  });

  test("it displays pathway before exam board for citizenship", () => {
    renderProgrammeFilters(
      createFilter({ years: ["10"], keystages: ["ks4"] }),
      {
        slugs: {
          subjectSlug: "citizenship",
          phaseSlug: "secondary",
          ks4OptionSlug: "core",
        },
        ks4Options: [
          { slug: "core", title: "Core" },
          { slug: "gcse", title: "GCSE" },
        ],
        ks4OptionFilterDimensions: {
          core: {
            tierSlugs: [],
            pathwaySlugs: ["core"],
            childSubjectSlugs: [],
          },
          gcse: {
            tierSlugs: [],
            pathwaySlugs: ["gcse"],
            childSubjectSlugs: [],
          },
        },
      },
    );

    const filterLegends = screen.getAllByRole("group");
    expect(filterLegends[0]).toHaveAccessibleName("Key stages");
    expect(filterLegends[1]).toHaveAccessibleName("Year group");
    expect(filterLegends[2]).toHaveAccessibleName("Pathway (KS4)");
    expect(filterLegends[3]).toHaveAccessibleName("Exam subject (KS4)");
  });
});
