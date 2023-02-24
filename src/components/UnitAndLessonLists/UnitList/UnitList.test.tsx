import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import { mockPaginationProps } from "../../Pagination/Pagination.test";
import teachersKeyStageSubjectUnitsFixture from "../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";

import UnitList from ".";

describe("components/UnitList", () => {
  test("renders the list items", () => {
    renderWithProviders(
      <UnitList
        {...teachersKeyStageSubjectUnitsFixture()}
        paginationProps={mockPaginationProps}
        currentPageItems={[]}
      />
    );
  });
});
