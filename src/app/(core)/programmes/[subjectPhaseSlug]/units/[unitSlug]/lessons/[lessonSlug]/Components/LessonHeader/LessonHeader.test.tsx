import { screen } from "@testing-library/dom";

import LessonHeader, { LessonHeaderProps } from "./LessonHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";

const render = renderWithTheme;

const defaultProps: LessonHeaderProps = {
  heading: "Lesson title",
  heroImage: "imageSrc",
  currentLessonSlug: "lesson-2",
  programmeSlug: "programme-1",
  unitSlug: "unit-1",
  prevLesson: {
    lessonIndex: 1,
    lessonSlug: "lesson-1",
    lessonTitle: "Lesson 1",
  },
  nextLesson: {
    lessonIndex: 3,
    lessonSlug: "lesson-3",
    lessonTitle: "Lesson 3",
  },
};

describe("LessonHeader", () => {
  it("renders prev and next lesson buttons", () => {
    render(<LessonHeader {...defaultProps} />);

    const prevLessonLink = screen.getByRole("link", {
      name: "Previous lesson",
    });
    expect(prevLessonLink).toBeInTheDocument();
    expect(prevLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-lesson-overview",
        lessonSlug: "lesson-1",
        unitSlug: defaultProps.unitSlug,
        programmeSlug: defaultProps.programmeSlug,
      }),
    );

    const nextLessonLink = screen.getByRole("link", { name: "Next lesson" });
    expect(nextLessonLink).toBeInTheDocument();
    expect(nextLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-lesson-overview",
        lessonSlug: "lesson-3",
        unitSlug: defaultProps.unitSlug,
        programmeSlug: defaultProps.programmeSlug,
      }),
    );
  });
});
