import {
  getDedupedPupilLessonOutcome,
  LessonOverview,
} from "./LessonOverview.view";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const lessonMediaClipsStarted = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonMediaClipsStarted: (...args: []) =>
        lessonMediaClipsStarted(...args),
    },
  }),
}));

describe("isPupilLessonOutcomeInKeyLearningPoints", () => {
  it("should return plo if the pupil lesson outcome is not in the key learning points", () => {
    const result = getDedupedPupilLessonOutcome("pupil lesson outcome", [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe("pupil lesson outcome");
  });
  it("should return undefined if pupilLessonOutcome is undefined ", () => {
    const result = getDedupedPupilLessonOutcome(undefined, [
      { keyLearningPoint: "key learning point" },
    ]);
    expect(result).toBe(undefined);
  });
  it("should return plo if the key learning points are undefined", () => {
    const result = getDedupedPupilLessonOutcome(
      "pupil lesson outcome",
      undefined,
    );
    expect(result).toBe("pupil lesson outcome");
  });
  it("should return null if the pupil lesson outcome is in the key learning points", () => {
    const result = getDedupedPupilLessonOutcome("pupil lesson outcome", [
      { keyLearningPoint: "pupil lesson outcome" },
    ]);
    expect(result).toBe(null);
  });
});
describe("lessonOverview.view", () => {
  describe("tracking", () => {
    it("should call track.lessonMediaClipsStarted when play all is clicked for media clips", () => {
      const { getByText } = renderWithTheme(
        <LessonOverview
          lesson={{
            ...lessonOverviewFixture(),
            isSpecialist: false,
            isCanonical: false,
            hasMediaClips: true,
          }}
          isBeta={false}
        />,
      );
      const playAllButton = getByText("Play all");
      playAllButton.click();
      expect(lessonMediaClipsStarted).toHaveBeenCalledWith({
        analyticsUseCase: "Teacher",
        componentType: "go_to_media_clips_page_button",
        engagementIntent: "use",
        eventVersion: "2.0.0",
        examBoard: null,
        keyStageSlug: "ks2",
        keyStageTitle: "Key Stage 2",
        learningCycle: undefined,
        lessonName: "Adverbial complex sentences",
        lessonReleaseCohort: "2020-2023",
        lessonReleaseDate: "2024-09-29T14:00:00.000Z",
        lessonSlug:
          "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
        mediaClipsButtonName: "play all",
        pathway: null,
        phase: null,
        platform: "owa",
        product: "media clips",
        releaseGroup: "legacy",
        subjectSlug: "english",
        subjectTitle: "English",
        tierName: null,
        unitName: "Simple, Compound and Adverbial Complex Sentences",
        unitSlug: "grammar-1-simple-compound-and-adverbial-complex-sentences",
        yearGroupName: null,
        yearGroupSlug: null,
      });
    });
  });
});
