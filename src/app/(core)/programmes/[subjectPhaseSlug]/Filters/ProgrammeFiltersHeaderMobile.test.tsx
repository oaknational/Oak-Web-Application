import { ComponentProps } from "react";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import ProgrammeFiltersHeaderMobile from "./ProgrammeFiltersHeaderMobile";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { createUnit } from "@/fixtures/curriculum/unit";
import { YearData } from "@/utils/curriculum/types";


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
  },
};

const defaultProps: ComponentProps<typeof ProgrammeFiltersHeaderMobile> = {
  onOpenModal: jest.fn(),
  onChangeFilters: jest.fn(),
  filters: {
    years: ["7", "8"],
    tiers: [],
    childSubjects: [],
    pathways: [],
    subjectCategories: [],
    threads: [],
  },
  data: {
    yearData: mockYearData,
    threadOptions: [],
    yearOptions: ["7", "8"],
  },
  trackingData: {
    subjectSlug: "english",
    subjectTitle: "English",
    phaseSlug: "secondary",
  },
  selectedYear: "year-all-7",
  onSelectYear: jest.fn(),
  slugs: {
    subjectSlug: "english",
    phaseSlug: "secondary",
    ks4OptionSlug: null,
  },
  ks4Options: [],
};

describe("Mobile filters header", () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });
  test("displays year group buttons", async () => {
    renderWithTheme(<ProgrammeFiltersHeaderMobile {...defaultProps} />);

    const yearButtons = await screen.findAllByTestId(
      "year-group-filter-button",
    );
    expect(yearButtons).toHaveLength(2);
  });

  test("shows selected year as pressed", async () => {
    renderWithTheme(
      <ProgrammeFiltersHeaderMobile
        {...defaultProps}
        selectedYear="year-all-7"
      />,
    );

    const yearButtons = await screen.findAllByTestId(
      "year-group-filter-button",
    );
    expect(yearButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(yearButtons[0]).toHaveStyle("background-color: #222222");
    expect(yearButtons[0]).toHaveTextContent("Year 7");
    expect(yearButtons[1]).toHaveAttribute("aria-pressed", "false");
    expect(yearButtons[1]).toHaveStyle("background-color: #ffffff");
    expect(yearButtons[1]).toHaveTextContent("Year 8");
  });
  test("scrolls when year button is clicked", async () => {
    renderWithTheme(<ProgrammeFiltersHeaderMobile {...defaultProps} />);

    const yearButtons = await screen.findAllByTestId(
      "year-group-filter-button",
    );
    const user = userEvent.setup();
    await user.click(yearButtons[1]!);

    await waitFor(() => expect(mockScrollTo).toHaveBeenCalled());
  });
});
