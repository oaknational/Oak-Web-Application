import { screen } from "@testing-library/react";

import LessonView from "./LessonView";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";

const render = renderWithProviders();

const baseProps = teachersLessonOverviewFixture();

describe("LessonView", () => {
  it("renders previous and next lesson links when adjacent lessons exist", () => {
    render(
      <LessonView
        {...baseProps}
        previousLesson={{
          lessonSlug: "lesson-2",
          lessonTitle: "Previous lesson",
          lessonIndex: 2,
        }}
        nextLesson={{
          lessonSlug: "lesson-4",
          lessonTitle: "Next lesson",
          lessonIndex: 4,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Previous lesson/i }),
    ).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-2",
    );
    expect(screen.getByRole("link", { name: /Next lesson/i })).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-4",
    );
  });

  it("does not render lesson nav links when adjacent lessons are missing", () => {
    render(
      <LessonView {...baseProps} previousLesson={null} nextLesson={null} />,
    );

    expect(
      screen.queryByRole("link", { name: /Previous lesson/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Next lesson/i }),
    ).not.toBeInTheDocument();
  });

  it("renders previous and next lesson links when orderInUnit is null", () => {
    render(
      <LessonView
        {...baseProps}
        orderInUnit={null}
        previousLesson={{
          lessonSlug: "lesson-2",
          lessonTitle: "Previous lesson",
          lessonIndex: 2,
        }}
        nextLesson={{
          lessonSlug: "lesson-4",
          lessonTitle: "Next lesson",
          lessonIndex: 4,
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Previous lesson/i }),
    ).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-2",
    );
    expect(screen.getByRole("link", { name: /Next lesson/i })).toHaveAttribute(
      "href",
      "/programmes/biology-secondary-ks3/units/cells/lessons/lesson-4",
    );
  });
});
