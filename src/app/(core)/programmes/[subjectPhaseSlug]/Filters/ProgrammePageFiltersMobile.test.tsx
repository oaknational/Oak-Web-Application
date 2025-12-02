import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import ProgrammePageFiltersMobile, {
  ProgrammePageMobileFiltersProps,
} from "./ProgrammePageFiltersMobile";

import { createUnit } from "@/fixtures/curriculum/unit";
import { YearData } from "@/utils/curriculum/types";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";


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
    subjectCategories: [
      { id: 1, slug: "category-1", title: "Category 1" },
      { id: 2, slug: "category-2", title: "Category 2" },
    ],
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

const defaultProps: ProgrammePageMobileFiltersProps = {
  filters: {
    years: ["7", "8"],
    tiers: [],
    childSubjects: [],
    pathways: [],
    subjectCategories: ["category-1", "category-2"],
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
  onChangeFilters: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(globalThis, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockOpen = jest.fn();
const mockClose = jest.fn();
// Mock HTMLDialogElement methods that jsdom doesn't support
HTMLDialogElement.prototype.showModal = mockOpen;
HTMLDialogElement.prototype.close = mockClose;

describe("ProgrammePageFiltersMobile", () => {
  it("opens modal on click", async () => {
    renderWithTheme(<ProgrammePageFiltersMobile {...defaultProps} />);

    const modalLink = screen.getByTestId("mobile-highlight-thread");
    const user = userEvent.setup();
    await user.click(modalLink);

    expect(mockOpen).toHaveBeenCalled();
  });
  it("renders correct filters", () => {
    renderWithTheme(<ProgrammePageFiltersMobile {...defaultProps} />);

    const categoryFilter1 = screen.getByTestId(
      "subject-category-radio-category-1",
    );
    expect(categoryFilter1).toBeInTheDocument();

    const categoryFilter2 = screen.getByTestId(
      "subject-category-radio-category-2",
    );
    expect(categoryFilter2).toBeInTheDocument();
  });
});
