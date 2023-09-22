import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";
import optionalityProps from "@/node-lib/curriculum-api/fixtures/optionality.fixture";
import UnitList from "@/components/UnitAndLessonLists/UnitList/UnitList";
import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";

const render = renderWithProviders();
describe("components/UnitList", () => {
  test("renders the list items", () => {
    render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={[]}
      />,
    );
  });
  test("renders the optionality list card when data has optional units", () => {
    const { getByTestId } = render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={optionalityProps.units}
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
      />,
    );
    const optionalityCard = queryByTestId("unit-optionality-card");
    expect(optionalityCard).not.toBeInTheDocument();
  });
});
