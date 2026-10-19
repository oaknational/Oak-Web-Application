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
        {
          questionType: "short-answer",
          questionUid: "q1",
          questionId: 1,
          order: 1,
          _state: "published",
        },
        {
          questionType: "short-answer",
          questionUid: "q2",
          questionId: 2,
          order: 2,
          _state: "published",
        },
      ] as never,
      initialQuestionResults: [
        { mode: "feedback", offerHint: false, grade: 1 },
        { mode: "init", offerHint: false, grade: 0 },
      ],
    });

    expect(store.getState().currentQuestionIndex).toBe(1);
    expect(store.getState().isHydratedComplete).toBe(false);
  });

  describe.each(["starter-quiz", "exit-quiz"] as const)(
    "%s hydration",
    (section) => {
      const questionsArray = [
        {
          questionType: "short-answer",
          questionUid: "q1",
          questionId: 1,
          order: 1,
          _state: "published",
        },
        {
          questionType: "short-answer",
          questionUid: "q2",
          questionId: 2,
          order: 2,
          _state: "published",
        },
      ] as const;
      const checkedAnswer = {
        mode: "feedback",
        offerHint: false,
        grade: 1,
      } as const;

      it("resumes the final checked question when the section was not completed", () => {
        const store = createPupilLessonQuizStore();
        store.getState().initialiseQuiz({
          lessonSlug: "intro-to-it",
          section,
          questionsArray: [...questionsArray],
          initialQuestionResults: [checkedAnswer, checkedAnswer],
          initialIsComplete: false,
        });

        expect(store.getState().isHydratedComplete).toBe(false);
        expect(store.getState().currentQuestionIndex).toBe(1);
        expect(store.getState().questionState[1]?.mode).toBe("feedback");
      });

      it("keeps the saved section completion state", () => {
        const store = createPupilLessonQuizStore();
        store.getState().initialiseQuiz({
          lessonSlug: "intro-to-it",
          section,
          questionsArray: [...questionsArray],
          initialQuestionResults: [checkedAnswer, checkedAnswer],
          initialIsComplete: true,
        });

        expect(store.getState().isHydratedComplete).toBe(true);
      });

      it("resumes the first question missing from saved progress", () => {
        const store = createPupilLessonQuizStore();
        store.getState().initialiseQuiz({
          lessonSlug: "intro-to-it",
          section,
          questionsArray: [...questionsArray],
          initialQuestionResults: [checkedAnswer],
        });

        expect(store.getState().isHydratedComplete).toBe(false);
        expect(store.getState().currentQuestionIndex).toBe(1);
        expect(store.getState().questionState[1]?.mode).toBe("init");
      });

      it("does not resume beyond the current question list", () => {
        const store = createPupilLessonQuizStore();
        store.getState().initialiseQuiz({
          lessonSlug: "intro-to-it",
          section,
          questionsArray: [...questionsArray],
          initialQuestionResults: [
            checkedAnswer,
            checkedAnswer,
            { mode: "init", offerHint: false, grade: 0 },
          ],
        });

        expect(store.getState().isHydratedComplete).toBe(false);
        expect(store.getState().currentQuestionIndex).toBe(1);
        expect(store.getState().questionState).toHaveLength(2);
      });
    },
  );

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
