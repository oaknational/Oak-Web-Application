import { fireEvent, screen } from "@testing-library/dom";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import SubjectCategoryFilters from "./SubjectCategoryFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const browseRefined = jest.fn();
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("SubjectCategoryFilters", () => {
  const mockRouter = {
    query: {},
    replace: jest.fn(),
    pathname: "/test-path",
  };
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders component", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          subjectCategories={[
            {
              label: "Grammar",
              slug: "grammar",
              iconName: "grammar",
            },
          ]}
          categorySlug={"all"}
          setSelectedCategory={() => {}}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Category")).toBeInTheDocument();
  });

  it("updates the router query and selected category on click", () => {
    const category = {
      slug: "test-category",
      label: "Test Category",
      iconName: "grammar",
    };
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          categorySlug={"all"}
          setSelectedCategory={() => {}}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
          subjectCategories={[category]}
        />
      </OakThemeProvider>,
    );

    const categoryButton = screen.getByText("Test Category");
    fireEvent.click(categoryButton);

    expect(mockRouter.replace).toHaveBeenCalledWith(
      {
        pathname: "/test-path",
        query: {
          category: "test-category",
        },
      },
      undefined,
      { shallow: true },
    );

    expect(getByText("Test Category")).toBeInTheDocument();
  });
});
