import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture, {
  combinedUnitListingFixture,
  swimmingUnitListingFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import optionalityProps from "@/node-lib/curriculum-api-2023/fixtures/optionality.fixture";
import UnitList, {
  getUnitLessonCount,
} from "@/components/TeacherComponents/UnitList/UnitList";
import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";

const onClick = jest.fn();

const render = (children: React.ReactNode) =>
  renderWithProviders()(
    <OakThemeProvider theme={oakDefaultTheme}>{children}</OakThemeProvider>,
  );

describe("components/UnitList", () => {
  test.skip("renders the list items", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={[]}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );
  });
  test("renders the optionality list card when data has optional units", () => {
    const { getByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={optionalityProps.units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );
    const optionalityCard = getByTestId("unit-optionality-card");
    expect(optionalityCard).toBeInTheDocument();
  });

  test("does not render the optionality list card when no optional units", () => {
    const { queryByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={unitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );
    const optionalityCard = queryByTestId("unit-optionality-card");
    expect(optionalityCard).not.toBeInTheDocument();
  });
  test("onClick is called when a unit is clicked", async () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={unitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );
    const units = screen.getAllByText("Data Representation");

    expect(units).toHaveLength(2);
    const unit = units[0];
    if (!unit) {
      throw new Error("Could not find unit");
    }

    userEvent.click(unit);

    await waitFor(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
  test("renders new and legacy units together", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...combinedUnitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={combinedUnitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const unitCards = screen.getAllByTestId("unit-list-item");
    expect(unitCards).toHaveLength(12);
  });
  test("begins index at 1 for legacy units on the same page as new units", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...combinedUnitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={combinedUnitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const indices = screen.getAllByTestId("unit-list-item");
    expect(indices[0]).toHaveTextContent("1");
    expect(indices[3]).toHaveTextContent("1");
  });
  test("shows header for new units when on the first page", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...combinedUnitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={combinedUnitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const header = screen.getByRole("heading", { name: "Maths units" });
    expect(header).toBeInTheDocument();
  });
  test("does not show header for new units when on a subsequent page", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...combinedUnitListingFixture()}
          paginationProps={{ ...mockPaginationProps, currentPage: 2 }}
          currentPageItems={combinedUnitListingFixture().units}
          onClick={onClick}
        />
        ,
      </OakThemeProvider>,
    );

    const header = screen.queryByText("Maths units");
    expect(header).not.toBeInTheDocument();
  });
  test("renders the header for legacy lessons on their first appearance regardless of page number", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...combinedUnitListingFixture()}
          paginationProps={{ ...mockPaginationProps, currentPage: 2 }}
          currentPageItems={combinedUnitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const header = screen.getByRole("heading", {
      name: "Units released in 2020-22",
    });
    expect(header).toBeInTheDocument();
  });
  test("does not render any headings when there are only legacy units", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...combinedUnitListingFixture()}
          paginationProps={{ ...mockPaginationProps, currentPage: 2 }}
          currentPageItems={combinedUnitListingFixture().units.slice(3)}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const header = screen.queryByRole("heading", {
      name: "Maths units",
    });
    expect(header).not.toBeInTheDocument();
    const legacyHeader = screen.queryByRole("heading", {
      name: "Units released in 2020-22",
    });
    expect(legacyHeader).not.toBeInTheDocument();
  });
  test("renders a curriculum download button for new units", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={unitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const curriculumDownloadLink = screen.getByText(
      "Full secondary curriculum",
    );

    expect(curriculumDownloadLink).toBeInTheDocument();
  });
  test("does not render a curriculum download button for excluded subjects", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture({ subjectSlug: "rshe-pshe" })}
          paginationProps={mockPaginationProps}
          currentPageItems={unitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    const curriculumDownloadLink = screen.queryByText(
      "Full secondary curriculum",
    );

    expect(curriculumDownloadLink).not.toBeInTheDocument;
  });

  test("renders Swimming units", () => {
    render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...swimmingUnitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={swimmingUnitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );

    expect("Swimming and water safety units (all years)").toBeInTheDocument;
    expect(
      "Swimming and water safety lessons should be selected based on the ability and experience of your pupils.",
    ).toBeInTheDocument;

    const unitCards = screen.getAllByTestId("unit-list-item");
    expect(unitCards).toHaveLength(6);
  });
});

describe("getUnitLessonCount", () => {
  it("returns the correct lesson count for a complete unit", () => {
    const result = getUnitLessonCount({
      lessonCount: 5,
      expiredLessonCount: 0,
      unpublishedLessonCount: 0,
    });
    expect(result).toEqual("5 lessons");
  });
  it("returns the correct lesson count for a unit with more expired lessons than not", () => {
    const result = getUnitLessonCount({
      lessonCount: 1,
      expiredLessonCount: 2,
      unpublishedLessonCount: 0,
    });
    expect(result).toEqual("0 lessons");
  });
  it("returns the correct pluralization for a single lesson", () => {
    const result = getUnitLessonCount({
      lessonCount: 1,
      expiredLessonCount: 0,
      unpublishedLessonCount: 0,
    });
    expect(result).toEqual("1 lesson");
  });
  it("returns the correct lesson count for a unit with expired lessons", () => {
    const result = getUnitLessonCount({
      lessonCount: 5,
      expiredLessonCount: 2,
      unpublishedLessonCount: 0,
    });
    expect(result).toEqual("3/5 lessons");
  });
  it("returns the correct lesson count for a unit with unpublished lessons", () => {
    const result = getUnitLessonCount({
      lessonCount: 5,
      expiredLessonCount: 0,
      unpublishedLessonCount: 2,
    });
    expect(result).toEqual("5/7 lessons");
  });
  it("returns the correct lesson count for a unit with both expired and unpublished lessons", () => {
    const result = getUnitLessonCount({
      lessonCount: 5,
      expiredLessonCount: 2,
      unpublishedLessonCount: 2,
    });
    expect(result).toEqual("3/7 lessons");
  });
});
