import { fireEvent } from "@testing-library/react";
import { ComponentProps } from "react";

import CurricVisualiserMobileHeader from ".";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { YearData } from "@/utils/curriculum/types";
import { createUnit } from "@/fixtures/curriculum/unit";

const render = renderWithProviders();

const curriculumThreadHighlighted = jest.fn();
const unitSequenceRefined = jest.fn();

const mockScrollTo = jest.fn();
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: mockScrollTo,
});

Object.defineProperty(document, "getElementById", {
  writable: true,
  value: jest.fn(() => ({ getBoundingClientRect: () => ({ top: 100 }) })),
});

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted: (...args: unknown[]) =>
        curriculumThreadHighlighted(...args),
      unitSequenceRefined: (...args: unknown[]) => unitSequenceRefined(...args),
    },
  }),
}));

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
  },
};

const mockTrackingData = {
  subjectTitle: "English",
  subjectSlug: "english",
  phaseSlug: "secondary",
  unitCount: 2,
};

const defaultProps: ComponentProps<typeof CurricVisualiserMobileHeader> = {
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
  trackingData: mockTrackingData,
  selectedYear: "year-all-7",
  onSelectYear: jest.fn(),
  slugs: {
    subjectSlug: "english",
    phaseSlug: "secondary",
    ks4OptionSlug: null,
  },
  ks4Options: [],
};

describe("CurricVisualiserMobileHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollTo.mockClear();
  });

  test("renders the component with basic elements", async () => {
    const { getByTestId, getByText } = render(
      <CurricVisualiserMobileHeader {...defaultProps} />,
    );

    expect(getByTestId("mobile-highlight-thread")).toBeInTheDocument();
    expect(getByText("Filter and highlight")).toBeInTheDocument();
    expect(getByTestId("year-selection-mobile")).toBeInTheDocument();
  });

  test("displays year group buttons", async () => {
    const { findAllByTestId } = render(
      <CurricVisualiserMobileHeader {...defaultProps} />,
    );

    const yearButtons = await findAllByTestId("year-group-filter-button");
    expect(yearButtons).toHaveLength(2);
  });

  test("calls onSelectYear and tracks analytics when year button is clicked", async () => {
    const mockOnSelectYear = jest.fn();
    const { findAllByTestId } = render(
      <CurricVisualiserMobileHeader
        {...defaultProps}
        onSelectYear={mockOnSelectYear}
      />,
    );

    const yearButtons = await findAllByTestId("year-group-filter-button");
    fireEvent.click(yearButtons[1]!); // Second year-group button

    expect(mockOnSelectYear).toHaveBeenCalledWith("all-8");
    expect(unitSequenceRefined).toHaveBeenCalled();
  });

  test("shows selected year as pressed", async () => {
    const { findAllByTestId } = render(
      <CurricVisualiserMobileHeader
        {...defaultProps}
        selectedYear="year-all-7"
      />,
    );

    const yearButtons = await findAllByTestId("year-group-filter-button");
    expect(yearButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(yearButtons[1]).toHaveAttribute("aria-pressed", "false");
  });

  test("sets initial year when none is selected", async () => {
    const mockOnSelectYear = jest.fn();
    render(
      <CurricVisualiserMobileHeader
        {...defaultProps}
        selectedYear=""
        onSelectYear={mockOnSelectYear}
      />,
    );

    // Wait for useEffect to run
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockOnSelectYear).toHaveBeenCalledWith("all-7");
  });

  test("scrolls when year button is clicked", async () => {
    const { findAllByTestId } = render(
      <CurricVisualiserMobileHeader {...defaultProps} />,
    );

    const yearButtons = await findAllByTestId("year-group-filter-button");
    fireEvent.click(yearButtons[0]!);

    expect(mockScrollTo).toHaveBeenCalled();
  });
});
