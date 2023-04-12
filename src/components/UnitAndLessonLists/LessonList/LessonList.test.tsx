import { mockPaginationProps } from "../../Pagination/Pagination.test";
import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import LessonList from ".";

const render = renderWithProviders();

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
        lessons={[
          {
            slug: "",
            title:
              "Creating a sculpture inspired by Chakaia Booker and Anish Kapoor",
            description:
              "In this lesson, we will look at artworks in relation to biomorphism. We will look at how Anish Kapoor and Chakaia Booker's sculptures have a biomorphic shape, and then create our own sculpture inspired by nature.",
            keyStageSlug: "ks4",
            subjectSlug: "maths",
            unitSlug: "some-unit-slug",
            quizCount: 1,
            videoCount: 1,
            presentationCount: 1,
            worksheetCount: 1,
            keyStageTitle: "Key stage 3",
            subjectTitle: "Maths",
            themeSlug: "circles",
            themeTitle: "Circles",
            hasCopyrightMaterial: false,
            expired: false,
          },
        ]}
      />
    );

    const listHeading = getByRole("heading", { level: 2 });

    expect(listHeading).toBeInTheDocument();
  });
});
