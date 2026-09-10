import { keysToCamelCase } from "zod-to-camel-case";

import LessonOverviewMediaClips from "./LessonOverviewMediaClips";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";
import lessonMediaClipsFixtures, {
  additionalCycles,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const lessonMediaClipsStarted = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    getSessionId: jest.fn(),
    track: {
      lessonMediaClipsStarted: (...args: unknown[]) =>
        lessonMediaClipsStarted(...args),
    },
  }),
}));

const render = renderWithProviders();

const mockLearningCycleVideos = lessonMediaClipsFixtures().mediaClips;
const lessonOutline = [
  { lessonOutline: "Lesson outline for cycle 1" },
  { lessonOutline: "Lesson outline for cycle 2" },
  { lessonOutline: "Lesson outline for cycle 3" },
  { lessonOutline: "Lesson outline for cycle 4" },
];

describe("LessonOverviewMediaClips", () => {
  it("renders titles correctly when there is an intro video", () => {
    const { getByText } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={lessonOutline}
        isPELesson={false}
        isMFL={false}
      />,
    );

    expect(getByText("Intro")).toBeInTheDocument();
  });

  it("renders titles correctly when there is no intro video", () => {
    const { getByText } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={additionalCycles}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={lessonOutline}
        isPELesson={false}
        isMFL={false}
      />,
    );

    expect(getByText("Lesson outline for cycle 3")).toBeInTheDocument();
    expect(getByText("Lesson outline for cycle 4")).toBeInTheDocument();
  });

  it("renders titles correctly for PE lesson with custom title", () => {
    const { getByText } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={lessonOutline}
        isPELesson={true}
        isMFL={false}
      />,
    );

    expect(getByText("Intro Video 1")).toBeInTheDocument();
  });

  it("renders titles correctly for MFL lesson with an intro video", () => {
    const { getByText } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={lessonOutline}
        isPELesson={false}
        isMFL={true}
      />,
    );

    expect(getByText("Keywords")).toBeInTheDocument();
    expect(getByText("Lesson outline for cycle 2")).toBeInTheDocument();
  });

  it("links clip tiles to lesson media", () => {
    const { getByRole } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={null}
        isPELesson={false}
        isMFL={false}
      />,
    );

    const introClipLink = getByRole("link", { name: /^Intro \d+ clips$/ });
    expect(introClipLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-media",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        query: { video: "191188" },
      }),
    );
  });

  it("links clip tiles to teachers lesson media when programmeSlug and unitSlug are provided", () => {
    const { getByRole } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={null}
        isPELesson={false}
        isMFL={false}
      />,
    );

    const introClipLink = getByRole("link", { name: /^Intro \d+ clips$/ });
    expect(introClipLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-media",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        query: { video: "191188" },
      }),
    );
  });

  it("links clip tiles to canonical lesson media when programmeSlug and unitSlug are not provided", () => {
    const { getByRole } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
        lessonSlug="lesson-slug"
        unitSlug={null}
        programmeSlug={null}
        lessonOutline={null}
        isPELesson={false}
        isMFL={false}
      />,
    );

    const introClipLink = getByRole("link", { name: /^Intro \d+ clips$/ });
    expect(introClipLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-media-canonical",
        lessonSlug: "lesson-slug",
        query: { video: "191188" },
      }),
    );
  });

  it("if no learning cycle videos component returns null", () => {
    const { queryByRole } = render(
      <LessonOverviewMediaClips
        learningCycleVideos={null}
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        lessonOutline={null}
        isPELesson={false}
        isMFL={false}
      />,
    );
    expect(queryByRole("link")).toBeNull();
  });
  describe("tracking", () => {
    test("fires lessonMediaClipsStarted when a clip is clicked", async () => {
      const { getByText } = render(
        <LessonOverviewMediaClips
          learningCycleVideos={keysToCamelCase(mockLearningCycleVideos)}
          lessonSlug="lesson-slug"
          unitSlug="unit-slug"
          programmeSlug="programme-slug"
          lessonOutline={lessonOutline}
          isPELesson={false}
          isMFL={false}
        />,
      );

      const lessonClip = getByText("Lesson outline for cycle 2");
      lessonClip.click();
      expect(lessonMediaClipsStarted).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaClipsButtonName: "select clip",
          learningCycle: "cycle2",
        }),
      );
    });
  });
});
