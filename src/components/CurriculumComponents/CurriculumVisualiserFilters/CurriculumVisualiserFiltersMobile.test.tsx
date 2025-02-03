import "jest-styled-components";

import CurriculumVisualiserFiltersMobile from "./CurriculumVisualiserFiltersMobile";
import { CurriculumVisualiserFiltersProps } from "./CurriculumVisualiserFilters";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
const curriculumThreadHighlighted = vi.fn();
const yearGroupSelected = vi.fn();

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted: (...args: unknown[]) =>
        curriculumThreadHighlighted(...args),
      yearGroupSelected: (...args: unknown[]) => yearGroupSelected(...args),
    },
  }),
}));

const emptyMockYearData = {
  units: [],
  childSubjects: [],
  subjectCategories: [],
  tiers: [],
  pathways: [],
  labels: [],
  groupAs: null,
};

const CurriculumVisualiserFiltersMobileFixture: CurriculumVisualiserFiltersProps =
  {
    //   updateMobileHeaderScroll: vi.fn(() => {}),
    onSelectThread: vi.fn(() => {}),
    selectedThread: null,
    selectedYear: "7",
    onSelectYear: vi.fn(() => {}),
    yearSelection: {},
    data: {
      threadOptions: [
        {
          title: "Comparing viewpoints and experiences",
          slug: "comparing-viewpoints-and-experiences",
          order: 5,
        },
        {
          title: "Exploring the unknown: mystery, intrigue and Gothic fiction",
          slug: "exploring-the-unknown-mystery-intrigue-and-gothic-fiction",
          order: 1,
        },
        {
          title: "Identity, belonging and community",
          slug: "identity-belonging-and-community",
          order: 2,
        },
        {
          title: "Language of persuasion",
          slug: "language-of-persuasi",
          order: 1,
        },
        {
          title: "Power, control and oppressive regimes",
          slug: "power-control-and-oppressive-regimes",
          order: 3,
        },
        {
          title: "Shakespeare and the outsider",
          slug: "shakespeare-and-the-outsider",
          order: 4,
        },
      ],
      yearOptions: ["7", "8", "9", "10", "11"],
      // visibleMobileYearRefID: "8",
      yearData: {
        "7": emptyMockYearData,
        "8": emptyMockYearData,
        "9": emptyMockYearData,
        "10": emptyMockYearData,
        "11": emptyMockYearData,
      },
      initialYearSelection: {},
    },
    trackingData: {
      subjectSlug: "",
      subjectTitle: "",
      phaseSlug: "",
      ks4OptionSlug: null,
    },
  };

describe("<CurriculumVisualiserFiltersMobile/>", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  const resizeWindow = (x: number, y: number) => {
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event("resize"));
  };

  test("mobile filters are visible", async () => {
    resizeWindow(390, 844);

    const { findByTestId } = render(
      <CurriculumVisualiserFiltersMobile
        {...CurriculumVisualiserFiltersMobileFixture}
      />,
    );
    // Open thread modal
    const filterThreadsButton = await findByTestId("mobile-highlight-thread");

    expect(filterThreadsButton).toBeInTheDocument();
  });

  test("mobile: mobile filter options visible", async () => {
    resizeWindow(390, 844);
    const { findByTestId, findAllByTestId } = render(
      <CurriculumVisualiserFiltersMobile
        {...CurriculumVisualiserFiltersMobileFixture}
      />,
    );
    const mobileThreadButton = await findByTestId("mobile-highlight-thread");
    const mobileYearFilter = await findByTestId("year-selection-mobile");
    const mobileYearFilterButtons = await findAllByTestId(
      "year-group-filter-button",
    );
    expect(mobileThreadButton).toBeInTheDocument();
    expect(mobileYearFilter).toBeInTheDocument();
    expect(mobileYearFilterButtons).toHaveLength(5);
  });

  test("mobile: anchor links for year group filters match", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    resizeWindow(390, 844);

    const { findAllByTestId } = render(
      <CurriculumVisualiserFiltersMobile
        {...CurriculumVisualiserFiltersMobileFixture}
        selectedYear="8"
      />,
    );

    const yearFilterButtons = await findAllByTestId("year-group-filter-button");
    const year8Button = yearFilterButtons[1]!;

    expect(year8Button).toHaveStyleRule("background-color: rgb(34, 34, 34);");
    expect(yearFilterButtons[0]).toHaveStyleRule(
      "background-color: rgb(242, 242, 242);",
    );
    expect(year8Button).toHaveTextContent("Year 8");
  });
});
