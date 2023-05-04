import { mockPaginationProps } from "../../Pagination/Pagination.test";
import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";
import lessonListingFixture from "../../../node-lib/curriculum-api/fixtures/lessonListing.fixture";

import LessonList from ".";

const render = renderWithProviders();

const lessonProps = lessonListingFixture().lessons;

describe("components/ Lesson List", () => {
  test("it renders the list items", () => {
    const { getByRole } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={[]}
        unitTitle={"Unit title"}
        lessons={lessonProps}
      />
    );

    const listHeading = getByRole("heading", { level: 2 });

    expect(listHeading).toBeInTheDocument();
  });
});
