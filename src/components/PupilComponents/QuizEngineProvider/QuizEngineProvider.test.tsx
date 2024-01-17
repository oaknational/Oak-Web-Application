import React from "react";
import { renderHook, act } from "@testing-library/react";

import {
  QuizEngineProps,
  QuizEngineProvider,
  useQuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import { quizQuestions as questionsArrayFixture } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";

const getLessonEngineContext = (): NonNullable<LessonEngineContextType> => ({
  currentSection: "starter-quiz",
  completedSections: [],
  sectionResults: {},
  getIsComplete: jest.fn(),
  completeSection: jest.fn(),
  updateCurrentSection: jest.fn(),
  proceedToNextSection: jest.fn(),
  updateQuizResult: jest.fn(),
});

describe("QuizEngineContext", () => {
  const wrapper = (
    { children, questionsArray }: QuizEngineProps,
    lessonEngineContext?: LessonEngineContextType,
  ) => {
    return (
      <LessonEngineContext.Provider
        value={
          lessonEngineContext ? lessonEngineContext : getLessonEngineContext()
        }
      >
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      </LessonEngineContext.Provider>
    );
  };

  describe("currentQuestionIndex", () => {
    it("should default to 0", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { currentQuestionIndex } = result.current;

      expect(currentQuestionIndex).toBe(0);
    });
  });

  describe("currentQuestionData", () => {
    it("should default to the first question", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { currentQuestionData } = result.current;

      expect(currentQuestionData).toEqual(questionsArrayFixture?.[0]);
    });
  });

  describe("questionState", () => {
    it("should default to the correct shape", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "init",
        feedback: undefined,
        offerHint: false,
        grade: 0,
      });
    });
  });

  describe("score", () => {
    it("should default to 0", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { score } = result.current;

      expect(score).toBe(0);
    });
  });

  describe("maxScore", () => {
    it("should default to the number of supported questions", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { maxScore } = result.current;

      expect(maxScore).toBe(
        questionsArrayFixture?.filter(
          (q) =>
            q.questionType === "multiple-choice" ||
            q.questionType === "short-answer",
        ).length,
      );
    });
  });

  it("should update currentQuestionIndex on handleNextQuestion", () => {
    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleNextQuestion } = result.current;

    act(() => {
      handleNextQuestion();
    });
    expect(result.current.currentQuestionIndex).toBe(1);
  });

  it("should update currentQuestionData on handleNextQuestion", () => {
    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleNextQuestion } = result.current;

    act(() => {
      handleNextQuestion();
    });
    expect(result.current.currentQuestionData).toBe(questionsArrayFixture?.[1]);
  });

  it("should update the section as complete when currentQuestionIndex is > maxScore", () => {
    const lessonEngineContext = getLessonEngineContext();

    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper: (props) =>
        wrapper(
          { ...props, questionsArray: questionsArrayFixture ?? [] },
          lessonEngineContext,
        ),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleNextQuestion, maxScore } = result.current;

    for (let i = 0; i < maxScore; i++) {
      act(() => {
        handleNextQuestion();
      });
      expect(result.current.currentQuestionIndex).toBe(i + 1); // act followed  by expect to ensure that state is updated
    }
    expect(lessonEngineContext.completeSection).toHaveBeenCalledWith(
      "starter-quiz",
    );
  });

  it("should update the current section to overview when the quiz is completed", () => {
    const lessonEngineContext = getLessonEngineContext();

    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper: (props) =>
        wrapper(
          { ...props, questionsArray: questionsArrayFixture ?? [] },
          lessonEngineContext,
        ),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleNextQuestion, maxScore } = result.current;

    for (let i = 0; i < maxScore; i++) {
      act(() => {
        handleNextQuestion();
      });
      expect(result.current.currentQuestionIndex).toBe(i + 1); // act followed  by expect to ensure that state is updated
    }
    expect(lessonEngineContext.updateCurrentSection).toHaveBeenCalledWith(
      "overview",
    );
  });

  describe("handleSubmitMCAnswer", () => {
    it("should grade a single answer mcq as correct if the pupilAnswer is correct", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { handleSubmitMCAnswer, currentQuestionData } = result.current;

      act(() => {
        handleSubmitMCAnswer(
          currentQuestionData?.answers?.["multiple-choice"]?.[2],
        );
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 1,
        feedback: ["correct", "correct", "correct", "correct"],
        offerHint: false,
      });
    });

    it("should grade a single answer mcq as incorrect if the pupilAnswer is incorrect", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { handleSubmitMCAnswer, currentQuestionData } = result.current;

      act(() => {
        handleSubmitMCAnswer(
          currentQuestionData?.answers?.["multiple-choice"]?.[0],
        );
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 0,
        feedback: ["incorrect", "correct", "incorrect", "correct"],
        offerHint: false,
      });
    });

    it("should grade a multi answer mcq as correct if all of the pupilAnswers are correct", () => {
      if (!questionsArrayFixture) {
        throw new Error("questionsArrayFixture is null");
      }

      const multiQs = [...questionsArrayFixture].filter(
        (question) => question.questionType === "multiple-choice",
      );

      // set the first answer as also correct
      if (multiQs[0]?.answers?.["multiple-choice"]?.[0]) {
        multiQs[0].answers["multiple-choice"][0].answer_is_correct = true;
      } else {
        throw new Error("multiQs[0] is not properly defined");
      }

      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) => wrapper({ ...props, questionsArray: multiQs }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { handleSubmitMCAnswer, currentQuestionData } = result.current;

      const pupilAnswers = currentQuestionData?.answers?.[
        "multiple-choice"
      ]?.filter((answer) => answer.answer_is_correct);

      act(() => {
        handleSubmitMCAnswer(pupilAnswers);
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 1,
        feedback: ["correct", "correct", "correct", "correct"],
        offerHint: false,
      });
    });

    it("should grade a multi answer mcq as incorrect if only some of the pupilAnswers are correct", () => {
      if (!questionsArrayFixture) {
        throw new Error("questionsArrayFixture is null");
      }

      const multiQs = [...questionsArrayFixture].filter(
        (question) => question.questionType === "multiple-choice",
      );

      // set the first answer as also correct
      if (multiQs[0]?.answers?.["multiple-choice"]?.[0]) {
        multiQs[0].answers["multiple-choice"][0].answer_is_correct = true;
      } else {
        throw new Error("multiQs[0] is not properly defined");
      }

      if (multiQs[0]?.answers?.["multiple-choice"]?.[1] === undefined) {
        throw new Error("multiQs[1] is not properly defined");
      }

      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) => wrapper({ ...props, questionsArray: multiQs }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { handleSubmitMCAnswer, currentQuestionData } = result.current;

      const pupilAnswers = [
        currentQuestionData?.answers?.["multiple-choice"]?.[0],
        currentQuestionData?.answers?.["multiple-choice"]?.[1],
      ];

      act(() => {
        //@ts-expect-error: we know that these will not be undefined
        handleSubmitMCAnswer(pupilAnswers);
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 0,
        feedback: ["correct", "incorrect", "incorrect", "correct"],
        offerHint: false,
      });
    });
  });

  describe("handleSubmitShortAnswer", () => {
    it("should grade a short answer as correct if the pupilAnswer is correct", () => {
      if (!Array.isArray(questionsArrayFixture)) {
        throw new Error("questionsArrayFixture is not an array");
      }

      const questions = [...questionsArrayFixture].filter(
        (q) => q.questionType === "short-answer",
      );

      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: questions,
          }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { handleSubmitShortAnswer, currentQuestionData } = result.current;

      act(() => {
        handleSubmitShortAnswer(
          currentQuestionData?.answers?.["short-answer"]?.[0]?.answer[0]?.text,
        );
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 1,
        feedback: "correct",
        offerHint: false,
      });
    });
  });

  it("should grade a short answer as incorrect if the pupilAnswer is incorrect", () => {
    if (!Array.isArray(questionsArrayFixture)) {
      throw new Error("questionsArrayFixture is not an array");
    }

    const questions = [...questionsArrayFixture].filter(
      (q) => q.questionType === "short-answer",
    );

    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper: (props) =>
        wrapper({
          ...props,
          questionsArray: questions,
        }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleSubmitShortAnswer } = result.current;

    act(() => {
      handleSubmitShortAnswer("this is not the correct answer");
    });

    const { questionState } = result.current;

    expect(questionState[0]).toEqual({
      mode: "feedback",
      grade: 0,
      feedback: "incorrect",
      offerHint: false,
    });
  });
});

describe("useQuizEngineContext", () => {
  it("throws an error when there is no context", () => {
    jest.spyOn(console, "error").mockImplementation(() => jest.fn()); // suppress console.error
    expect(() => renderHook(() => useQuizEngineContext())).toThrow(
      "`QuizEngineProvider` is not available",
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
