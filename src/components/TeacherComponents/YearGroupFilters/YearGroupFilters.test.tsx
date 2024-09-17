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
    push: jest.fn(),
    pathname: "/test-path",
  };
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders component", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <YearGroupFilters
          yearGroups={[
            {
              yearTitle: "Year 1",
              year: "year-1",
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
          yearGroups={[
            {
              yearTitle: "Year 1",
              year: "year-1",
            },
          ]}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
        />
      </OakThemeProvider>,
    );

    const yearButton = screen.getByText("Year 1");
    fireEvent.click(yearButton);

    expect(mockRouter.push).toHaveBeenCalledWith(
      {
        pathname: "/test-path",
        query: {
          year: "year-1",
        },
      },
      undefined,
      { shallow: true },
    );

    expect(getByText("Year")).toBeInTheDocument();
  });
});
