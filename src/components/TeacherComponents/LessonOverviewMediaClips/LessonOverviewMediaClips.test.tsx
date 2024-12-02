import LessonOverviewMediaClips from "./LessonOverviewMediaClips";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

jest.mock("@/common-lib/urls", () => ({
  resolveOakHref: jest.fn(),
}));

// TODO: Clean up the tests
// TODO: Add storybook file so can test with more video entries

const mockLearningCycleVideos = lessonMediaClipsFixtures().mediaClips;

describe("LessonOverviewMediaClips", () => {
  it("renders correctly with given props", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={mockLearningCycleVideos}
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
      />,
    );

    expect(
      getByText("Introduction physical exercise video"),
    ).toBeInTheDocument();
    expect(getByText("Cycle 1 Video")).toBeInTheDocument();
  });

  it("calls resolveOakHref with correct arguments when programmeSlug and unitSlug are provided", () => {
    renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={mockLearningCycleVideos}
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media",
      lessonSlug: "cycle-1-running-video",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media",
      lessonSlug: "cycle-2-video",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
    });
  });

  it("calls resolveOakHref with correct arguments when programmeSlug and unitSlug are not provided", () => {
    renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={mockLearningCycleVideos}
        unitSlug={null}
        programmeSlug={null}
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media-canonical",
      lessonSlug: "introduction-physical-exercise-video",
    });

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media-canonical",
      lessonSlug: "cycle-1-running-video",
    });
  });
});
