import { ComponentProps } from "react";
import { screen } from "@testing-library/dom";
import { usePathname } from "next/navigation";

import ProgrammeFiltersHeaderMobile from "./ProgrammeFiltersHeaderMobile";

import { createUnit } from "@/fixtures/curriculum/unit";
import { YearData } from "@/utils/curriculum/types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { BrowseFiltersProvider } from "@/context/BrowseFilters";

jest.mock("next/navigation");

(usePathname as jest.Mock).mockReturnValue("/");

const mockScrollTo = jest.fn();
Object.defineProperty(globalThis, "scrollTo", {
  writable: true,
  value: mockScrollTo,
});

Object.defineProperty(document, "getElementById", {
  writable: true,
  value: jest.fn(() => ({ getBoundingClientRect: () => ({ top: 100 }) })),
});

const mockYearData: YearData = {
  "7": {
    units: [
      createUnit({
        year: "7",
        slug: "test-unit-year-7",
        title: "Test Unit Year 7",
        subject: "English",
        subject_slug: "english",
        threads: [],
        lessons: [],
      }),
    ],
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],
    isSwimming: false,
    groupAs: null,
    nationalCurriculum: [],
    keystage: "ks3",
  },
  "8": {
    units: [
      createUnit({
        year: "8",
        slug: "test-unit-year-8",
        title: "Test Unit Year 8",
        subject: "English",
        subject_slug: "english",
        threads: [],
        lessons: [],
      }),
    ],
    childSubjects: [],
    pathways: [],
    tiers: [],
    subjectCategories: [],
    isSwimming: false,
    groupAs: null,
    nationalCurriculum: [],
    keystage: "ks3",
  },
};

const render = renderWithProviders();

const defaultProps: ComponentProps<typeof ProgrammeFiltersHeaderMobile> = {
  onOpenModal: jest.fn(),
  data: {
    yearData: mockYearData,
    threadOptions: [],
    yearOptions: ["7", "8"],
    keystages: ["ks3"],
  },
  slugs: {
    subjectSlug: "english",
    phaseSlug: "secondary",
    ks4OptionSlug: null,
  },
  ks4Options: [],
  ks4OptionFilterDimensions: {},
};

describe("Mobile filters header", () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });
  test("displays all filters button", async () => {
    render(
      <BrowseFiltersProvider
        defaultFilter={{
          years: ["7", "8"],
          tiers: [],
          childSubjects: [],
          pathways: [],
          subjectCategories: [],
          threads: [],
          keystages: [],
        }}
      >
        <ProgrammeFiltersHeaderMobile {...defaultProps} />
      </BrowseFiltersProvider>,
    );

    const allFiltersBtn = screen.getByText("All filters");
    expect(allFiltersBtn).toBeInTheDocument();
  });
});
