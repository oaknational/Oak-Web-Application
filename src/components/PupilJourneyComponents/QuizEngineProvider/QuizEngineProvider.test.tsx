import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react";

import {
  QuizEngineProps,
  QuizEngineProvider,
  QuizEngineContext,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { max } from "lodash";
import waitForNextTick from "@/__tests__/__helpers__/waitForNextTick";

const questionsArrayFixture = quizQuestions || [];

describe("useQuizEngineContext", () => {
  it("'currentQuestionIndex' should default to 0", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { currentQuestionIndex } = result.current;

    expect(currentQuestionIndex).toBe(0);
  });

  it("'currentQuestionData' should default to the first question", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { currentQuestionData } = result.current;

    expect(currentQuestionData).toEqual(questionsArrayFixture[0]);
  });

  it("'questionState' should default to the correct shape", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { questionState } = result.current;

    expect(questionState[0]).toEqual({
      mode: "input",
      feedback: undefined,
      offerHint: false,
      grade: 0,
    });
  });

  it("'score' should default to 0", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { score } = result.current;

    expect(score).toBe(0);
  });

  it("'maxScore' should default to the number of mcq questions", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { maxScore } = result.current;

    expect(maxScore).toBe(
      questionsArrayFixture.filter((q) => q.questionType === "multiple-choice")
        .length,
    );
  });

  it("should update currentQuestionIndex on handleNextQuestion", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
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
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleNextQuestion } = result.current;

    act(() => {
      handleNextQuestion();
    });
    expect(result.current.currentQuestionData).toBe(questionsArrayFixture[1]);
  });

  it("should update isComplete when currentQuestionData is > maxScore", async () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    if (result.current === null) {
      throw new Error("result.current is null");
    }

    const { handleNextQuestion, maxScore } = result.current;

    for (let i = 0; i < maxScore; i++) {
      act(() => {
        handleNextQuestion();
      });
      expect(result.current.currentQuestionIndex).toBe(i + 1);
    }
    expect(result.current.isComplete).toBe(true);
  });

  it.skip("'handleSubmitMCAnswer' should update the questionState", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
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
    expect(questionState).toEqual({
      mode: "feedback",
      answer: "correct",
      offerHint: false,
      maximumScore: 3,
      score: 1,
    });
  });
});
