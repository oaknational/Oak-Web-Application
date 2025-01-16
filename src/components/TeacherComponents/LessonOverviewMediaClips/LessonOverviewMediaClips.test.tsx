import LessonOverviewMediaClips from "./LessonOverviewMediaClips";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import keysToCamelCase from "@/utils/snakeCaseConverter";

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

const mockLearningCycleVideos = lessonMediaClipsFixtures().mediaClips;

describe("LessonOverviewMediaClips", () => {
  it("renders correctly with given props", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={[{ lessonOutline: "This is the lesson outline" }]}
      />,
    );

    expect(getByText("Intro")).toBeInTheDocument();
  });

  it("calls resolveOakHref with correct arguments when programmeSlug and unitSlug are provided", () => {
    renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={[{ lessonOutline: "This is the lesson outline" }]}
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      query: { video: "191188" },
    });

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      query: { video: "191188" },
    });
  });

  it("calls resolveOakHref with correct arguments when programmeSlug and unitSlug are not provided", () => {
    renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug={null}
        programmeSlug={null}
        lessonOutline={[{ lessonOutline: "This is the lesson outline" }]}
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media-canonical",
      lessonSlug: "lesson-slug",
      query: { video: "191188" },
    });

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media-canonical",
      lessonSlug: "lesson-slug",
      query: { video: "191188" },
    });
  });
});
