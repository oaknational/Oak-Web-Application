import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react";

import {
  QuizEngineProps,
  QuizEngineProvider,
  quizEngineContext,
} from "./QuizEngineProvider";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

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
    const { result } = renderHook(() => useContext(quizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

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
    const { result } = renderHook(() => useContext(quizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

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
    const { result } = renderHook(() => useContext(quizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    const { questionState } = result.current;

    expect(questionState).toEqual({
      mode: "input",
      answer: undefined,
      offerHint: false,
    });
  });
  it("'handleSubmitMCAnswer' should update the questionState", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(quizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

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
    });
  });
  it("'handleNextQuestion' should update the questionState", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(quizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture }),
    });

    const { handleNextQuestion } = result.current;

    act(() => {
      handleNextQuestion();
    });

    const { questionState } = result.current;
    expect(questionState).toEqual({
      mode: "input",
      answer: undefined,
      offerHint: false,
    });
    expect(result.current.currentQuestionIndex).toBe(1);
  });
});
