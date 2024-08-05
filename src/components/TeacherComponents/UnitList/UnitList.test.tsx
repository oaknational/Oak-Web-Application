import { act, screen, fireEvent } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useRouter } from "next/router";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture, {
  combinedUnitListingFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import optionalityProps from "@/node-lib/curriculum-api-2023/fixtures/optionality.fixture";
import UnitList from "@/components/TeacherComponents/UnitList/UnitList";
import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";

const onClick = jest.fn();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const render = (children: React.ReactNode) =>
  renderWithProviders()(
    <OakThemeProvider theme={oakDefaultTheme}>{children}</OakThemeProvider>,
  );

describe("components/UnitList", () => {
  let pushMock: jest.Mock;
  let scrollToMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn().mockResolvedValue(true);
    scrollToMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
      asPath: "/current-path",
    });
    window.scrollTo = scrollToMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the list items", () => {
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

  test("should navigate to the correct page and scroll to top on page change", async () => {
    const { getByTestId } = render(
      <UnitList
        {...combinedUnitListingFixture()}
        currentPageItems={combinedUnitListingFixture().units}
        paginationProps={mockPaginationProps}
        onClick={onClick}
      />,
    );

    const paginationButton = getByTestId("forwards-button");
    fireEvent.click(paginationButton);

    expect(pushMock).toHaveBeenCalledWith(
      {
        pathname: "/current-path",
        query: { page: 2 },
      },
      undefined,
      { shallow: true, scroll: false },
    );

    await pushMock();

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
