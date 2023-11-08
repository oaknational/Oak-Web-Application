import NextLessonContainer from "./NextLessonContainer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("NextLessonContainer", () => {
  it("should render component", () => {
    const { getByRole } = renderWithTheme(
      <NextLessonContainer
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
        futureLessons={["test-lesson", "test-lesson-2", "test-lesson-3"]}
        unitTitle="test-unit-title"
      />,
    );

    const nextLessonContainerTitle = getByRole("heading", {
      name: "More lessons in: test-unit-title",
    });

    expect(nextLessonContainerTitle).toBeInTheDocument();
  });
  it("when passed an array of 3 future lessons renders all 3", async () => {
    const { getAllByTestId } = renderWithTheme(
      <NextLessonContainer
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
        futureLessons={["test-lesson", "test-lesson-2", "test-lesson-3"]}
        unitTitle="test-unit-title"
      />,
    );

    const nextLessonCards = await getAllByTestId("next-lesson-card");

    expect(nextLessonCards).toHaveLength(3);
  });

  it("when passed an array of 4 future lessons only renders 3", async () => {
    const { getAllByTestId } = renderWithTheme(
      <NextLessonContainer
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
        futureLessons={[
          "test-lesson",
          "test-lesson-2",
          "test-lesson-3",
          "test-lesson-4",
        ]}
        unitTitle="test-unit-title"
      />,
    );

    const nextLessonCards = await getAllByTestId("next-lesson-card");

    expect(nextLessonCards).toHaveLength(3);
  });
});
