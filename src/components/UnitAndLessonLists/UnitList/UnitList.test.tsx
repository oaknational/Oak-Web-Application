import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import { mockPaginationProps } from "../../Pagination/Pagination.test";
import teachersKeyStageSubjectUnitsFixture from "../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";

import UnitList from ".";

const render = renderWithProviders();
describe("components/UnitList", () => {
  test("renders the list items", () => {
    render(
      <UnitList
        {...teachersKeyStageSubjectUnitsFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={[]}
      />
    );
  });
});
