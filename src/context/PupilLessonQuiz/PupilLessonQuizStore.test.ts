import { createPupilLessonQuizStore } from "./usePupilLessonQuiz";

describe("PupilLessonQuizStore", () => {
  it("initialises quiz state from questions and empty progress", () => {
    const store = createPupilLessonQuizStore();

    store.getState().initialiseQuiz({
      lessonSlug: "intro-to-it",
      section: "starter-quiz",
      questionsArray: [
        { questionType: "short-answer", questionUid: "q1" },
        { questionType: "explanatory-text", questionUid: "q2" },
      ] as never,
    });

    expect(store.getState().lessonSlug).toBe("intro-to-it");
    expect(store.getState().section).toBe("starter-quiz");
    expect(store.getState().currentQuestionIndex).toBe(0);
    expect(store.getState().numQuestions).toBe(2);
    expect(store.getState().numInteractiveQuestions).toBe(1);
  });

  it("hydrates to the first unanswered question", () => {
    const store = createPupilLessonQuizStore();

    store.getState().initialiseQuiz({
      lessonSlug: "intro-to-it",
      section: "starter-quiz",
      questionsArray: [
        { questionType: "short-answer", questionUid: "q1" },
        { questionType: "short-answer", questionUid: "q2" },
      ] as never,
      initialQuestionResults: [
        { mode: "feedback", offerHint: false, grade: 1 },
        { mode: "init", offerHint: false, grade: 0 },
      ],
    });

    expect(store.getState().currentQuestionIndex).toBe(1);
    expect(store.getState().isHydratedComplete).toBe(false);
  });

  it("marks hydrated quiz complete when all questions are already in feedback mode", () => {
    const store = createPupilLessonQuizStore();

    store.getState().initialiseQuiz({
      lessonSlug: "intro-to-it",
      section: "starter-quiz",
      questionsArray: [
        { questionType: "short-answer", questionUid: "q1" },
      ] as never,
      initialQuestionResults: [
        { mode: "feedback", offerHint: false, grade: 1 },
      ],
    });

    expect(store.getState().isHydratedComplete).toBe(true);
    expect(store.getState().currentQuestionIndex).toBe(1);
  });

  it("updates the current question state and advances to the next question", () => {
    const store = createPupilLessonQuizStore();

    store.getState().initialiseQuiz({
      lessonSlug: "intro-to-it",
      section: "starter-quiz",
      questionsArray: [
        { questionType: "short-answer", questionUid: "q1" },
      ] as never,
    });

    store.getState().applyCurrentQuestionResult({
      mode: "feedback",
      grade: 1,
      feedback: "correct",
    });

    expect(store.getState().questionState[0]).toEqual({
      mode: "feedback",
      offerHint: false,
      grade: 1,
      feedback: "correct",
    });

    store.getState().handleNextQuestion();

    expect(store.getState().currentQuestionIndex).toBe(1);
  });
});
