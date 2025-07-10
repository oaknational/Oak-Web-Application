import { fireEvent, screen } from "@testing-library/dom";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import SubjectCategoryFilters from "./SubjectCategoryFilters";

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

describe("SubjectCategoryFilters", () => {
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
        <SubjectCategoryFilters
          subjectCategories={[
            {
              label: "Grammar",
              slug: "grammar",
              iconName: "grammar",
            },
          ]}
          categorySlug={"all"}
          idSuffix={"desktop"}
          setCategory={jest.fn()}
        />
      </OakThemeProvider>,
    );
    expect(getByText("Category")).toBeInTheDocument();
  });

  it("calls setCategory on click", () => {
    const mockSetCategory = jest.fn();
    const category = {
      slug: "test-category",
      label: "Test Category",
      iconName: "grammar",
    };
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          categorySlug={"all"}
          idSuffix={"desktop"}
          subjectCategories={[category]}
          setCategory={mockSetCategory}
        />
      </OakThemeProvider>,
    );

    const categoryButton = screen.getByText("Test Category");

    fireEvent.click(categoryButton);

    expect(mockSetCategory).toHaveBeenCalledWith("test-category");
    expect(getByText("Test Category")).toBeInTheDocument();
  });

  it("on mobile, setCategory function invoked with selected category", () => {
    const mockSetCategory = jest.fn();

    const category = {
      slug: "test-category",
      label: "Test Category",
      iconName: "grammar",
    };
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          categorySlug={"all"}
          idSuffix={"mobile"}
          setCategory={mockSetCategory}
          subjectCategories={[category]}
        />
      </OakThemeProvider>,
    );

    const categoryButton = screen.getByText("Test Category");
    fireEvent.click(categoryButton);

    expect(mockSetCategory).toHaveBeenCalledWith("test-category");
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
