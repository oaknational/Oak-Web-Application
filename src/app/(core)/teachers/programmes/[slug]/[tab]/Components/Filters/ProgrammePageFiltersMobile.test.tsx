import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { useEffect, useState, type ReactNode } from "react";

import {
  ProgrammeNavigationProvider,
  useProgrammeNavigation,
} from "../../../../ProgrammeNavigationProvider";

import { KS4OptionFocusProvider } from "./KS4OptionFocus";
import ProgrammePageFiltersMobile from "./ProgrammePageFiltersMobile";
import { ProgrammePageFiltersProps } from "./ProgrammePageFiltersDesktop";
import { ProgrammePageFiltersModalProvider } from "./ProgrammePageFiltersModalProvider";

import { createUnit } from "@/fixtures/curriculum/unit";
import { YearData } from "@/utils/curriculum/types";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { BrowseFiltersProvider } from "@/context/BrowseFilters";
import { BrowseFilters } from "@/context/BrowseFilters/types";
import { createFilter } from "@/context/BrowseFilters/utils/fixtures";

const useSearchParamsMock = jest.fn();
const replaceStateMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useSearchParams: () => useSearchParamsMock(),
  useRouter: () => ({
    prefetch: jest.fn(),
  }),
}));

globalThis.history.replaceState(
  null,
  "",
  "/teachers/programmes/english-secondary-ocr/units",
);
jest
  .spyOn(globalThis.history, "replaceState")
  .mockImplementation(replaceStateMock);

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

const defaultFilters = createFilter({
  years: ["7", "8"],
  subjectCategories: ["category-1", "category-2"],
});

const defaultProps: ProgrammePageFiltersProps = {
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

const ks4ExamBoardFilters = createFilter({
  keystages: ["ks4"],
  years: ["10"],
});

const ks4ExamBoardProps: ProgrammePageFiltersProps = {
  ...defaultProps,
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

function SeedMobileNavigation({
  children,
  restoreFocus,
}: {
  children: ReactNode;
  restoreFocus?: boolean;
}) {
  const { setNavigationIntent } = useProgrammeNavigation();
  const [ready, setReady] = useState(restoreFocus === undefined);
  useEffect(() => {
    if (restoreFocus !== undefined) {
      setNavigationIntent({
        destination: ks4ExamBoardProps.slugs,
        restoreFocus,
        reopenFiltersModal: true,
      });
      setReady(true);
    }
  }, [restoreFocus, setNavigationIntent]);
  return ready ? children : null;
}

function renderMobile(
  props: ProgrammePageFiltersProps = defaultProps,
  filters: BrowseFilters = defaultFilters,
  restoreFocus?: boolean,
) {
  return render(
    <ProgrammeNavigationProvider>
      <SeedMobileNavigation restoreFocus={restoreFocus}>
        <BrowseFiltersProvider defaultFilter={filters}>
          <ProgrammePageFiltersModalProvider>
            <KS4OptionFocusProvider slugs={props.slugs}>
              <ProgrammePageFiltersMobile {...props} />
            </KS4OptionFocusProvider>
          </ProgrammePageFiltersModalProvider>
        </BrowseFiltersProvider>
      </SeedMobileNavigation>
    </ProgrammeNavigationProvider>,
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
    expect(
      screen.getByRole("heading", { name: "Filters", level: 1 }),
    ).not.toHaveFocus();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).not.toHaveFocus();
    }
  });

  it("focuses the first filter when opened with the keyboard", async () => {
    const user = userEvent.setup();
    renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters);

    await user.tab();
    expect(screen.getByRole("button", { name: "All filters" })).toHaveFocus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "KS4" })).toHaveFocus();
    });
    expect(
      screen.getByRole("heading", { name: "Filters", level: 1 }),
    ).not.toHaveFocus();
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

  it("opens the modal after pointer navigation without focusing a key stage", async () => {
    renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters, false);

    expect(
      screen.getByRole("heading", { name: "Filters", level: 1 }),
    ).not.toHaveFocus();
    expect(screen.getByRole("radio", { name: "KS4" })).not.toHaveFocus();
  });

  it.each(["mouse", "touch"])(
    "keeps key-stage selection unfocused for %s and supports subsequent keyboard navigation",
    async () => {
      const user = userEvent.setup();
      renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters);

      await user.tab();
      await user.keyboard("{Enter}");
      const ks4 = screen.getByRole("radio", { name: "KS4" });
      expect(ks4).toHaveFocus();
      const button = screen.getByText("KS3").parentElement!;
      await user.click(button);

      const ks3 = screen.getByRole("radio", { name: "KS3" });
      expect(ks3).toBeChecked();
      expect(ks3).not.toHaveFocus();
      expect(ks4).not.toHaveFocus();
      expect(
        screen.getByRole("heading", { name: "Filters", level: 1 }),
      ).not.toHaveFocus();

      await user.tab();
      expect(ks3).toHaveFocus();
      await user.keyboard("{ArrowRight}");
      expect(ks4).toBeChecked();
      expect(ks4).toHaveFocus();
    },
  );

  it("focuses the selected exam board after navigation reopens the modal", async () => {
    renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters, true);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Filters", level: 1 }),
      ).toBeInTheDocument();

      expect(screen.getByRole("radio", { name: "OCR" })).toHaveFocus();
    });
  });

  it.each(["mouse", "touch"])(
    "resumes keyboard navigation at the year clicked with %s",
    async () => {
      const user = userEvent.setup();
      renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters, false);

      await user.tab();
      expect(screen.getByRole("radio", { name: "KS4" })).toHaveFocus();

      const year10 = screen.getByRole("radio", { name: "Year 10" });
      const button = screen.getByText("Year 10").parentElement!;
      await user.click(button);

      expect(year10).toBeChecked();
      for (const radio of screen.getAllByRole("radio")) {
        expect(radio).not.toHaveFocus();
      }
      await user.tab();
      expect(year10).toHaveFocus();
      await user.keyboard("{ArrowLeft}");
      const allYears = screen.getByTestId("all-years-radio");
      expect(allYears).toBeChecked();
      expect(allYears).toHaveFocus();
    },
  );

  it("clears keyboard focus even when clicking the already-selected key stage", async () => {
    const user = userEvent.setup();
    renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters, false);

    await user.tab();
    const ks4 = screen.getByRole("radio", { name: "KS4" });
    expect(ks4).toHaveFocus();

    await user.click(screen.getByText("KS4").parentElement!);

    expect(ks4).toBeChecked();
    expect(ks4).not.toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "Filters", level: 1 }),
    ).not.toHaveFocus();
  });

  it("remembers a keyboard position after resuming from a clicked option", async () => {
    const user = userEvent.setup();
    renderMobile(ks4ExamBoardProps, ks4ExamBoardFilters, false);

    await user.click(screen.getByText("Year 10").parentElement!);
    await user.tab();
    const year10 = screen.getByRole("radio", { name: "Year 10" });
    expect(year10).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    const allYears = screen.getByTestId("all-years-radio");
    expect(allYears).toHaveFocus();

    const scope = allYears.closest("fieldset")!.parentElement!.parentElement!;
    await user.click(scope);
    expect(allYears).not.toHaveFocus();

    await user.tab();
    expect(allYears).toHaveFocus();
  });
});
