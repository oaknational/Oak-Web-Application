import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import { mockPaginationProps } from "../../Pagination/Pagination.test";
import teachersKeyStageSubjectUnitsFixture from "../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";

import UnitList from ".";

describe("components/UnitList", () => {
  test("renders the list items", () => {
    const { getByRole } = renderWithProviders(
      <UnitList
        {...teachersKeyStageSubjectUnitsFixture()}
        headingTag={"h1"}
        paginationProps={mockPaginationProps}
        currentPageItems={[]}
      />
    );

    const listHeading = getByRole("heading", { level: 1 });

    expect(listHeading).toBeInTheDocument();
  });
});
