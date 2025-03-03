import { act, screen } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture, {
  combinedUnitListingFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import optionalityProps from "@/node-lib/curriculum-api-2023/fixtures/optionality.fixture";
import UnitList from "@/components/TeacherComponents/UnitList/UnitList";
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
  test("onClick is called when a unit is clicked", () => {
    const { getByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <UnitList
          {...unitListingFixture()}
          paginationProps={mockPaginationProps}
          currentPageItems={unitListingFixture().units}
          onClick={onClick}
        />
      </OakThemeProvider>,
    );
    const unit = getByText("Data Representation");

    act(() => {
      unit.click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
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
    expect(unitCards).toHaveLength(6);
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
});
