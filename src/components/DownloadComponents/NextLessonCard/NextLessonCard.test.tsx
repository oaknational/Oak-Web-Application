import NextLessonCard from "./NextLessonCard";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("NextLessonCard", () => {
  it("should render component", () => {
    const { getByText } = renderWithTheme(
      <NextLessonCard
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    expect(getByText("Heading")).toBeInTheDocument();
  });
});
