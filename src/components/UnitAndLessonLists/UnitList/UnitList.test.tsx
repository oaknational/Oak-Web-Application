import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import { mockPaginationProps } from "../../Pagination/Pagination.test";
import unitListingFixture from "../../../node-lib/curriculum-api/fixtures/unitListing.fixture";

import UnitList from ".";

const render = renderWithProviders();
describe("components/UnitList", () => {
  test("renders the list items", () => {
    render(
      <UnitList
        {...unitListingFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={[]}
      />
    );
  });
});
