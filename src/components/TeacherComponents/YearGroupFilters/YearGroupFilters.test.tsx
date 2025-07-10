import { fireEvent, screen } from "@testing-library/dom";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import YearGroupFilters from "./YearGroupFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const browseRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => browseRefined(...args),
    },
  }),
}));
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
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          yearGroupSlug=""
          idSuffix={"desktop"}
          setYear={jest.fn()}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Year")).toBeInTheDocument();
  });

  it("calls set year year on click", async () => {
    const mockSetYear = jest.fn();
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          yearGroupSlug=""
          setYear={mockSetYear}
          idSuffix={"desktop"}
        />
      </OakThemeProvider>,
    );
    const yearInput = screen.getByDisplayValue("desktop-year-1");

    fireEvent.click(yearInput);
    expect(mockSetYear).toHaveBeenCalledWith("year-1");

    expect(getByText("Year")).toBeInTheDocument();
  });

  it("on mobile, passed in setYear function invoked with selected input", () => {
    const mockSetYear = jest.fn();
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          yearGroups={[
            {
              yearTitle: "Year 1",
              yearSlug: "year-1",
              year: "1",
            },
          ]}
          idSuffix={"mobile"}
          yearGroupSlug=""
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
