import { act } from "react-dom/test-utils";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";
import optionalityProps from "@/node-lib/curriculum-api/fixtures/optionality.fixture";
import UnitList from "@/components/TeacherComponents/UnitList/UnitList";
import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";

const onClick = jest.fn();

const render = renderWithProviders();
describe("components/UnitList", () => {
  test("renders the list items", () => {
    render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={[]}
        onClick={onClick}
      />,
    );
  });
  test("renders the optionality list card when data has optional units", () => {
    const { getByTestId } = render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={optionalityProps.units}
        onClick={onClick}
      />,
    );
    const optionalityCard = getByTestId("unit-optionality-card");
    expect(optionalityCard).toBeInTheDocument();
  });

  test("does not render the optionality list card when no optional units", () => {
    const { queryByTestId } = render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={unitListingFixture().units}
        onClick={onClick}
      />,
    );
    const optionalityCard = queryByTestId("unit-optionality-card");
    expect(optionalityCard).not.toBeInTheDocument();
  });
  test("onClick is called when a unit is clicked", () => {
    const { getByText } = render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={unitListingFixture().units}
        onClick={onClick}
      />,
    );
    const unit = getByText("Data Representation");

    act(() => {
      unit.click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
