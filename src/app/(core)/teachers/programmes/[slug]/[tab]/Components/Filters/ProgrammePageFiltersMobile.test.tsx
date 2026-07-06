import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { usePathname, useSearchParams } from "next/navigation";

import { KS4OptionFocusProvider } from "./KS4OptionFocus";
import {
  FOCUS_KS4_OPTION_QUERY_PARAM,
  OPEN_FILTERS_MODAL_QUERY_PARAM,
} from "./KS4OptionFocus/ks4OptionFocusParams";
import ProgrammePageFiltersMobile from "./ProgrammePageFiltersMobile";
import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";
import { ProgrammePageFiltersModalProvider } from "./ProgrammePageFiltersModalProvider";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createFilter } from "@/fixtures/curriculum/filters";
import { YearData } from "@/utils/curriculum/types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/navigation");

const useSearchParamsMock = jest.fn();
const replaceStateMock = jest.fn();

(usePathname as jest.Mock).mockReturnValue("/");

jest.mocked(useSearchParams).mockImplementation(() => useSearchParamsMock());

Object.defineProperty(globalThis, "history", {
  value: {
    replaceState: replaceStateMock,
  },
  writable: true,
});

Object.defineProperty(globalThis, "location", {
  value: {
    pathname: "/teachers/programmes/english-secondary-ocr/units",
  },
  writable: true,
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
    subjectCategories: [
      { id: 1, slug: "category-1", title: "Category 1" },
      { id: 2, slug: "category-2", title: "Category 2" },
    ],
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
  "10": {
    units: [
      createUnit({
        year: "10",
        slug: "test-unit-year-10",
        title: "Test Unit Year 10",
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
    keystage: "ks4",
  },
};

const defaultProps: ProgrammePageFiltersProps = {
  filters: {
    years: ["7", "8"],
    tiers: [],
    childSubjects: [],
    pathways: [],
    subjectCategories: ["category-1", "category-2"],
    threads: [],
    keystages: [],
  },
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
  onChangeFilters: jest.fn(),
};

const ks4ExamBoardProps: ProgrammePageFiltersProps = {
  ...defaultProps,
  filters: createFilter({ keystages: ["ks4"], years: ["10"] }),
  data: {
    ...defaultProps.data,
    yearOptions: ["7", "8", "10"],
    keystages: ["ks3", "ks4"],
  },
  slugs: {
    subjectSlug: "english",
    phaseSlug: "secondary",
    ks4OptionSlug: "ocr",
  },
  ks4Options: [
    { slug: "aqa", title: "AQA" },
    { slug: "edexcel", title: "Edexcel" },
    { slug: "ocr", title: "OCR" },
  ],
  ks4OptionFilterDimensions: {
    ocr: {
      tierSlugs: ["foundation"],
      pathwaySlugs: [],
      childSubjectSlugs: [],
    },
  },
};

const render = renderWithProviders();

function renderMobile(props: ProgrammePageFiltersProps = defaultProps) {
  return render(
    <ProgrammePageFiltersModalProvider>
      <KS4OptionFocusProvider>
        <ProgrammePageFiltersMobile {...props} />
      </KS4OptionFocusProvider>
    </ProgrammePageFiltersModalProvider>,
  );
}

describe("ProgrammePageFiltersMobile", () => {
  beforeEach(() => {
    replaceStateMock.mockClear();
    useSearchParamsMock.mockReturnValue(new URLSearchParams(""));
  });

  it("opens modal on click", async () => {
    renderMobile();

    expect(
      screen.queryByRole("heading", { name: "Filters", level: 1 }),
    ).not.toBeInTheDocument();

    const openButton = screen.getByRole("button", { name: "All filters" });
    const user = userEvent.setup();
    await user.click(openButton);

    expect(
      screen.getByRole("heading", { name: "Filters", level: 1 }),
    ).toBeInTheDocument();
  });

  it("renders correct filters", async () => {
    renderMobile();

    const openButton = screen.getByRole("button", { name: "All filters" });
    const user = userEvent.setup();
    await user.click(openButton);

    const categoryFilter1 = screen.getByTestId(
      "subject-category-radio-category-1",
    );
    expect(categoryFilter1).toBeInTheDocument();

    const categoryFilter2 = screen.getByTestId(
      "subject-category-radio-category-2",
    );
    expect(categoryFilter2).toBeInTheDocument();
  });

  it("opens the modal when ephemeral restore params are present", () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        `${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr&${OPEN_FILTERS_MODAL_QUERY_PARAM}=1`,
      ),
    );

    renderMobile(ks4ExamBoardProps);

    expect(
      screen.getByRole("heading", { name: "Filters", level: 1 }),
    ).toBeInTheDocument();
  });

  it("restores focus to the exam board radio after opening from restore params", async () => {
    useSearchParamsMock.mockReturnValue(
      new URLSearchParams(
        `${FOCUS_KS4_OPTION_QUERY_PARAM}=ocr&${OPEN_FILTERS_MODAL_QUERY_PARAM}=1`,
      ),
    );

    const focusSpy = jest.spyOn(HTMLInputElement.prototype, "focus");

    renderMobile(ks4ExamBoardProps);

    await waitFor(() => {
      const ocrRadio = screen.getByDisplayValue("ocr");
      expect(focusSpy.mock.instances).toContain(ocrRadio);
    });

    focusSpy.mockRestore();
  });
});
