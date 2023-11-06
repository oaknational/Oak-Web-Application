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

    const nextLessonCardTitle = getByText("test-lesson");

    expect(nextLessonCardTitle).toBeInTheDocument();
  });
  it("should render see lesson link with correct href", () => {
    const { getByRole } = renderWithTheme(
      <NextLessonCard
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const seeLessonLink = getByRole("link", { name: "See lesson" });

    expect(seeLessonLink).toBeInTheDocument();
    expect(seeLessonLink).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-slug",
    );
  });

  it("should render download lesson link with correct href", () => {
    const { getByRole } = renderWithTheme(
      <NextLessonCard
        lessonTitle="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonSlug="test-slug"
      />,
    );

    const downloadResourcesLink = getByRole("link", {
      name: "Download resources",
    });

    expect(downloadResourcesLink).toBeInTheDocument();
    expect(downloadResourcesLink).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-slug/downloads",
    );
  });
});
