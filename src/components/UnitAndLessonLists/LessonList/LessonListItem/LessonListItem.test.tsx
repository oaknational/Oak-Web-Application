import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders";

import LessonListItem from "./LessonListItem";

const props = {
  title: "Macbeth",
  slug: "macbeth-lesson-1",
  presentationCount: 1,
  quizCount: 2,
  subjectSlug: "english",
  keyStageSlug: "4",
  description: "In this lesson",
  unitSlug: "foo",
  videoCount: 1,
  worksheetCount: 2,
  keyStageTitle: "Key stage 3",
  subjectTitle: "Maths",
  themeSlug: "circles",
  themeTitle: "Circles",
  hasCopyrightMaterial: false,
};

describe("Lesson List Item", () => {
  test("It shows lesson title", () => {
    const { getByRole } = renderWithProviders(<LessonListItem {...props} />);
    const lessonHeading = getByRole("heading", { level: 3 });

    expect(lessonHeading).toBeInTheDocument();
  });

  test("It shows lesson description", () => {
    const { getAllByText } = renderWithProviders(<LessonListItem {...props} />);

    const description = getAllByText("In this lesson")[0];

    expect(description).toBeInTheDocument();
  });

  test("It is a link to the lesson overview page", () => {
    const { getByText } = renderWithProviders(<LessonListItem {...props} />);

    expect(getByText("Macbeth").closest("a")).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/4/subjects/english/units/foo/lessons/macbeth-lesson-1"
    );
  });

  //   test("It doesn't presentations if none", () => {});
  //   test("It doesn't worksheets if none", () => {});
  //   test("It doesn't videos if none", () => {});
  //   test("It doesn't quizzes if none", () => {});
});
