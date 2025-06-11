import { fireEvent, screen } from "@testing-library/dom";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import YearGroupFilters from "./YearGroupFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const browseRefined = jest.fn();
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("YearGroupFilters", () => {
  const mockRouter = {
    query: {},
    replace: jest.fn(),

    pathname: "/test-path",
  };
  beforeEach(() => {
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders component", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          programmeSlug="test-programme"
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Year")).toBeInTheDocument();
  });

  it("updates the router query and selected year on click", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          programmeSlug="test-programme"
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
        />
      </OakThemeProvider>,
    );

    const yearButton = screen.getByText("Year 1");
    fireEvent.click(yearButton);

    expect(mockRouter.replace).toHaveBeenCalledWith(
      {
        pathname: "/test-path",
        query: {
          year: "year-1",
          programmeSlug: "test-programme",
        },
      },
      undefined,
      { shallow: true },
    );

    expect(getByText("Year")).toBeInTheDocument();
  });

  it("browse refined analytics provider invoked with correct props", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          programmeSlug="test-programme"
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
        />
      </OakThemeProvider>,
    );

    const yearButton = screen.getByText("Year 1");
    fireEvent.click(yearButton);

    expect(browseRefined).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "filter_link",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterValue: "Year 1",
      filterType: "Subject filter",
      activeFilters: {
        content_types: "units",
        learning_themes: undefined,
        categories: undefined,
      },
    });
  });

  it("on mobile, passed in setYear function invoked with selected input", () => {
    const mockSetYear = jest.fn();
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          programmeSlug="test-programme"
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          browseRefined={browseRefined}
          idSuffix={"mobile"}
          setYear={mockSetYear}
        />
      </OakThemeProvider>,
    );

    const yearButton = screen.getByText("Year 1");
    fireEvent.click(yearButton);

    expect(mockSetYear).toHaveBeenCalledWith("year-1");
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
