import LessonOverviewMediaClips from "./LessonOverviewMediaClips";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

vi.mock("@/common-lib/urls", () => ({
  resolveOakHref: vi.fn(),
}));

const mockLearningCycleVideos = lessonMediaClipsFixtures().mediaClips;

describe("LessonOverviewMediaClips", () => {
  it("renders correctly with given props", () => {
    const { getByText } = renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={mockLearningCycleVideos}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
      />,
    );

    expect(
      getByText("Introduction physical exercise video"),
    ).toBeInTheDocument();
    expect(getByText("Cycle 1 running video")).toBeInTheDocument();
  });

  it("calls resolveOakHref with correct arguments when programmeSlug and unitSlug are provided", () => {
    renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={mockLearningCycleVideos}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      query: { video: "cycle-1-running-video" },
    });

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media",
      lessonSlug: "lesson-slug",
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      query: { video: "cycle-2-video" },
    });
  });

  it("calls resolveOakHref with correct arguments when programmeSlug and unitSlug are not provided", () => {
    renderWithTheme(
      <LessonOverviewMediaClips
        learningCycleVideos={mockLearningCycleVideos}
        lessonSlug="lesson-slug"
        unitSlug={null}
        programmeSlug={null}
      />,
    );

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media-canonical",
      lessonSlug: "lesson-slug",
      query: { video: "introduction-physical-exercise-video" },
    });

    expect(resolveOakHref).toHaveBeenCalledWith({
      page: "lesson-media-canonical",
      lessonSlug: "lesson-slug",
      query: { video: "cycle-1-running-video" },
    });
  });
});
