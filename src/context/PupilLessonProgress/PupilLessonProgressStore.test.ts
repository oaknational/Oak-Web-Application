import { createPupilLessonProgressStore } from "./usePupilLessonProgress";

describe("PupilLessonProgressStore", () => {
  it("initialises lesson state for a lesson slug", () => {
    const store = createPupilLessonProgressStore();

    store.getState().initialiseLessonProgress({
      lessonSlug: "intro-to-it",
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
    });

    expect(store.getState().lessonSlug).toBe("intro-to-it");
    expect(store.getState().lessonReviewSections).toEqual([
      "intro",
      "starter-quiz",
      "video",
      "exit-quiz",
    ]);
    expect(store.getState().isLessonComplete).toBe(false);
  });

  it("preserves progress across repeated initialisation for the same lesson", () => {
    const store = createPupilLessonProgressStore();

    store.getState().initialiseLessonProgress({
      lessonSlug: "intro-to-it",
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
    });
    store.getState().completeSection("intro");

    store.getState().initialiseLessonProgress({
      lessonSlug: "intro-to-it",
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
    });

    expect(store.getState().sectionResults.intro?.isComplete).toBe(true);
    expect(store.getState().lessonStarted).toBe(true);
  });

  it("resets progress when initialising a different lesson slug", () => {
    const store = createPupilLessonProgressStore();

    store.getState().initialiseLessonProgress({
      lessonSlug: "lesson-one",
      lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
    });
    store.getState().completeSection("intro");

    store.getState().initialiseLessonProgress({
      lessonSlug: "lesson-two",
      lessonReviewSections: ["intro", "starter-quiz"],
    });

    expect(store.getState().lessonSlug).toBe("lesson-two");
    expect(store.getState().sectionResults).toEqual({});
    expect(store.getState().lessonStarted).toBe(false);
  });

  it("marks lesson complete when all configured review sections are complete", () => {
    const store = createPupilLessonProgressStore();

    store.getState().initialiseLessonProgress({
      lessonSlug: "lesson-one",
      lessonReviewSections: ["intro", "starter-quiz"],
    });
    store.getState().completeSection("intro");
    expect(store.getState().isLessonComplete).toBe(false);
    store.getState().completeSection("starter-quiz");

    expect(store.getState().isLessonComplete).toBe(true);
  });

  it("marks non-video sections incomplete when section results are updated", () => {
    const store = createPupilLessonProgressStore();

    store.getState().initialiseLessonProgress({
      lessonSlug: "lesson-one",
      lessonReviewSections: ["starter-quiz"],
    });
    store.getState().completeSection("starter-quiz");
    expect(store.getState().sectionResults["starter-quiz"]?.isComplete).toBe(
      true,
    );

    store.getState().updateSectionInProgressResult("starter-quiz", {
      grade: 3,
      numQuestions: 4,
    });

    expect(store.getState().sectionResults["starter-quiz"]?.isComplete).toBe(
      false,
    );
  });

  it("preserves video completion when video section result is updated", () => {
    const store = createPupilLessonProgressStore();

    store.getState().initialiseLessonProgress({
      lessonSlug: "lesson-one",
      lessonReviewSections: ["video"],
    });
    store.getState().completeSection("video");

    store.getState().updateSectionInProgressResult("video", {
      duration: 120,
      muted: false,
      played: true,
      signedOpened: false,
      timeElapsed: 60,
      transcriptOpened: true,
    });

    expect(store.getState().sectionResults.video?.isComplete).toBe(true);
  });
});
