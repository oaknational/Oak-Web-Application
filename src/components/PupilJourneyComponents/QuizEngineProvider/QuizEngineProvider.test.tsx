import React, { useContext } from "react";
import { renderHook, act } from "@testing-library/react";

import {
  QuizEngineProps,
  QuizEngineProvider,
  QuizEngineContext,
} from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { quizQuestions as questionsArrayFixture } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("useQuizEngineContext", () => {
  describe("currentQuestionIndex", () => {
    it("should default to 0", () => {
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
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
  });

  describe("score", () => {
    it("should default to 0", () => {
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
    it("should default to the number of mcq questions", () => {
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });

      if (result.current === null) {
        throw new Error("result.current is null");
      }

      const { maxScore } = result.current;

      expect(maxScore).toBe(
        questionsArrayFixture?.filter(
          (q) => q.questionType === "multiple-choice",
        ).length,
      );
    });
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
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
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
    expect(result.current.currentQuestionData).toBe(questionsArrayFixture[1]);
  });

  it("should update isComplete when currentQuestionData is > maxScore", () => {
    const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
      return (
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      );
    };
    const { result } = renderHook(() => useContext(QuizEngineContext), {
      wrapper: (props) =>
        wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
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
    expect(result.current.isComplete).toBe(true);
  });

  describe("handleSubmitMCAnswer", () => {
    it("should grade a single answer mcq as correct if the pupilAnswer is correct", () => {
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
        feedback: [null, null, "correct", null],
        offerHint: false,
      });
    });

    it("should grade a single answer mcq as incorrect if the pupilAnswer is incorrect", () => {
      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };
      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
        feedback: ["incorrect", null, null, null],
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

      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };

      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
        feedback: ["correct", null, "correct", null],
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

      const wrapper = ({ children, questionsArray }: QuizEngineProps) => {
        return (
          <QuizEngineProvider questionsArray={questionsArray}>
            {children}
          </QuizEngineProvider>
        );
      };

      const { result } = renderHook(() => useContext(QuizEngineContext), {
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
        feedback: ["correct", "incorrect", null, null],
        offerHint: false,
      });
    });
  });
});
