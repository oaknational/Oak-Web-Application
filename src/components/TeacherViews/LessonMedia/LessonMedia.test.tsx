import { LessonMedia } from "./LessonMedia.view";

import { resolveOakHref } from "@/common-lib/urls";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const render = renderWithProviders();

const lesson = lessonMediaClipsFixtures();

describe("LessonMedia view", () => {
  it("renders 'Back to lesson' button with correct link", () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );
    const backToLessonButton = getByTestId("back-to-lesson-button");

    expect(backToLessonButton).toHaveTextContent("Back to lesson");
    expect(backToLessonButton).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug: lesson.programmeSlug,
        lessonSlug: lesson.lessonSlug,
        unitSlug: lesson.unitSlug,
      }),
    );
  });
});
