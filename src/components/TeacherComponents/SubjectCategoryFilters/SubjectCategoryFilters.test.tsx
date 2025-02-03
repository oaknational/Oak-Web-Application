import { fireEvent, screen } from "@testing-library/dom";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import SubjectCategoryFilters from "./SubjectCategoryFilters";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const browseRefined = vi.fn();
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

describe("SubjectCategoryFilters", () => {
  const mockRouter = {
    query: {},
    replace: vi.fn(),
    pathname: "/test-path",
  };
  beforeEach(() => {
    vi.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders component", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          programmeSlug={"test-programme"}
          subjectCategories={[
            {
              label: "Grammar",
              slug: "grammar",
              iconName: "grammar",
            },
          ]}
          categorySlug={"all"}
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
          programmeSlug={"test-programme"}
          categorySlug={"all"}
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
          programmeSlug: "test-programme",
        },
      },
      undefined,
      { shallow: true },
    );

    expect(getByText("Test Category")).toBeInTheDocument();
  });

  it("browse refined analytics provider invoked with correct props", () => {
    const category = {
      slug: "test-category",
      label: "Test Category",
      iconName: "grammar",
    };
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          programmeSlug={"test-programme"}
          categorySlug={"all"}
          browseRefined={browseRefined}
          idSuffix={"desktop"}
          subjectCategories={[category]}
        />
      </OakThemeProvider>,
    );

    const categoryButton = screen.getByText("Test Category");
    fireEvent.click(categoryButton);

    expect(browseRefined).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "filter_link",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterValue: "Test Category",
      filterType: "Subject filter",
      activeFilters: {
        content_types: "units",
        learning_themes: undefined,
        year_group: undefined,
      },
    });
  });

  it("on mobile, setCategory function invoked with selected category", () => {
    const mockSetCategory = vi.fn();

    const category = {
      slug: "test-category",
      label: "Test Category",
      iconName: "grammar",
    };
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SubjectCategoryFilters
          programmeSlug={"test-programme"}
          categorySlug={"all"}
          browseRefined={browseRefined}
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
