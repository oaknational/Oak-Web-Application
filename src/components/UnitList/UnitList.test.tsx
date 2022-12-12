import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";
import { mockPaginationProps } from "../Pagination/Pagination.test";

import UnitList from ".";

describe("components/UnitList", () => {
  test("renders the list items", () => {
    const { getByRole } = renderWithProviders(
      <UnitList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h1"}
        tiers={[]}
        tierSlug={null}
        currentPageItems={[]}
        units={[
          {
            title:
              "1, To build knowledge of the historical context of the play ‘Macbeth’",
            slug: "To-build-knowledge",
            themeTitle: "MacBeth",
            lessonCount: 4,
            quizCount: 0,
            subjectSlug: "english",
            keyStageSlug: "2",
          },
        ]}
      />
    );

    const listHeading = getByRole("heading", { level: 1 });

    expect(listHeading).toBeInTheDocument();
  });
});
