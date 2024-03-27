import userEvent from "@testing-library/user-event";

import UnitsTabMobile from "./UnitsTabMobile";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();
const curriculumThreadHighlighted = jest.fn();
const yearGroupSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      curriculumThreadHighlighted: (...args: unknown[]) =>
        curriculumThreadHighlighted(...args),
      yearGroupSelected: (...args: unknown[]) => yearGroupSelected(...args),
    },
  }),
}));

const unitsTabMobileFixture = {
  updateMobileHeaderScroll: jest.fn(() => {}),
  handleSelectThread: jest.fn(() => {}),
  isSelectedThread: jest.fn(() => true),
  highlightedUnitCount: jest.fn(() => 1),
  trackSelectYear: jest.fn(() => {}),
  selectedThread: null,
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
  visibleMobileYearRefID: "8",
};

describe("components/pages/CurriculumInfo/tabs/UnitsTabMobile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockIntersectionObserver = jest.fn();
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
      <UnitsTabMobile {...unitsTabMobileFixture} />,
    );
    // Open thread modal
    const filterThreadsButton = await findByTestId("mobile-highlight-thread");

    expect(filterThreadsButton).toBeInTheDocument();
  });

  test("mobile: mobile filter options visible", async () => {
    resizeWindow(390, 844);
    const { findByTestId, findAllByTestId } = render(
      <UnitsTabMobile {...unitsTabMobileFixture} />,
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
      <UnitsTabMobile {...unitsTabMobileFixture} />,
    );

    const yearFilterButtons = await findAllByTestId("year-group-filter-button");
    const year8Button = yearFilterButtons[1];
    if (year8Button) {
      await userEvent.click(year8Button);
      // Selected button background colour should change
      expect(year8Button).toHaveStyle("background-color: rgb(34, 34, 34);");
      // Unselected button background colour shouldn't change
      expect(yearFilterButtons[0]).toHaveStyle(
        "background-color: rgb(242, 242, 242);",
      );
      expect(year8Button).toHaveTextContent("Year 8");
    }
  });
});
