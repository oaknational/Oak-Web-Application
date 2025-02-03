import React from "react";
import { renderHook, act } from "@testing-library/react";

import { createQuestionData } from "../pupilTestHelpers/createQuizEngineContext";
import { isText } from "../QuizUtils/stemUtils";

import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import {
  QuizEngineProps,
  QuizEngineProvider,
  useQuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import {
  matchAnswers,
  orderAnswers,
  quizQuestions as questionsArrayFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { invariant } from "@/utils/invariant";
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, vi.fn()])),
  identify: vi.fn(),
  posthogDistinctId: "123",
};

vi.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);
describe("QuizEngineContext", () => {
  const wrapper = (
    {
      children,
      questionsArray = questionsArrayFixture,
    }: Partial<QuizEngineProps>,
    lessonEngineContext: LessonEngineContextType = createLessonEngineContext(),
  ) => {
    return (
      <LessonEngineContext.Provider value={lessonEngineContext}>
        <QuizEngineProvider questionsArray={questionsArray}>
          {children}
        </QuizEngineProvider>
      </LessonEngineContext.Provider>
    );
  };

  describe("currentQuestionIndex", () => {
    it("should default to 0", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper,
      });
      const { currentQuestionIndex } = result.current;

      expect(currentQuestionIndex).toBe(0);
    });
  });

  describe("currentQuestionData", () => {
    it("should default to the first question", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper,
      });
      const { currentQuestionData } = result.current;

      expect(currentQuestionData).toEqual(questionsArrayFixture?.[0]);
    });
  });

  describe("questionState", () => {
    it("should default to the correct shape", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper,
      });
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
        wrapper,
      });
      const { score } = result.current;

      expect(score).toBe(0);
    });
  });

  describe("numQuestions", () => {
    it("should default to the number of supported questions", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper,
      });
      const { numQuestions } = result.current;

      expect(numQuestions).toBe(
        questionsArrayFixture?.filter(
          (q) => q.questionType !== "explanatory-text",
        ).length,
      );
    });
  });

  it("should update currentQuestionIndex on handleNextQuestion", () => {
    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper,
    });
    const { handleNextQuestion } = result.current;

    act(() => {
      handleNextQuestion();
    });
    expect(result.current.currentQuestionIndex).toBe(1);
  });

  it("should update currentQuestionData on handleNextQuestion", () => {
    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper,
    });

    const { handleNextQuestion } = result.current;

    act(() => {
      handleNextQuestion();
    });
    expect(result.current.currentQuestionData).toBe(questionsArrayFixture?.[1]);
  });

  it("should update the section as complete when currentQuestionIndex is > numQuestions", () => {
    const lessonEngineContext = createLessonEngineContext();
    const { result } = renderHook(() => useQuizEngineContext(), {
      wrapper: (props) => wrapper(props, lessonEngineContext),
    });
    const { handleNextQuestion, numQuestions } = result.current;

    for (let i = 0; i < numQuestions; i++) {
      act(() => {
        handleNextQuestion();
      });
      expect(result.current.currentQuestionIndex).toBe(i + 1); // act followed  by expect to ensure that state is updated
    }
    expect(lessonEngineContext.completeActivity).toHaveBeenCalledWith(
      "starter-quiz",
    );
  });

  describe("handleSubmitMCAnswer", () => {
    it("should grade a single answer mcq as correct if the pupilAnswer is correct", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
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

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 1,
        feedback: ["correct", "correct", "correct", "correct"],
        offerHint: false,
        isPartiallyCorrect: false,
        correctAnswer: [
          "a group of words that contains a verb and makes complete sense",
        ],
        pupilAnswer: [2],
      });
    });

    it("should grade a single answer mcq as incorrect if the pupilAnswer is incorrect", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({ ...props, questionsArray: questionsArrayFixture ?? [] }),
      });
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
        isPartiallyCorrect: false,
        correctAnswer: [
          "a group of words that contains a verb and makes complete sense",
        ],
        pupilAnswer: [0],
      });
    });

    it("should grade a multi answer mcq as correct if all of the pupilAnswers are correct", () => {
      const multiQs = structuredClone(
        questionsArrayFixture.filter(
          (question) => question.questionType === "multiple-choice",
        ),
      );
      // set the first answer as also correct
      multiQs[0]!.answers!["multiple-choice"]![0]!.answerIsCorrect = true;

      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) => wrapper({ ...props, questionsArray: multiQs }),
      });

      const { handleSubmitMCAnswer, currentQuestionData } = result.current;

      const pupilAnswers = currentQuestionData?.answers?.[
        "multiple-choice"
      ]?.filter((answer) => answer.answerIsCorrect);

      act(() => {
        handleSubmitMCAnswer(pupilAnswers);
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 1,
        feedback: ["correct", "correct", "correct", "correct"],
        offerHint: false,
        isPartiallyCorrect: false,
        correctAnswer: [
          "a sentence starter followed by a comma",
          "a group of words that contains a verb and makes complete sense",
        ],
        pupilAnswer: [0, 2],
      });
    });

    it("should grade a multi answer mcq as incorrect if only some of the pupilAnswers are correct", () => {
      const multiQs = structuredClone(
        questionsArrayFixture.filter(
          (question) => question.questionType === "multiple-choice",
        ),
      );
      multiQs[0]!.answers!["multiple-choice"]![0]!.answerIsCorrect = true;

      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) => wrapper({ ...props, questionsArray: multiQs }),
      });

      const { handleSubmitMCAnswer, currentQuestionData } = result.current;

      invariant(
        currentQuestionData?.answers?.["multiple-choice"]?.[0],
        "MCQ not defined",
      );

      invariant(
        currentQuestionData?.answers?.["multiple-choice"]?.[1],
        "MCQ not defined",
      );

      const pupilAnswers: MCAnswer[] = [
        currentQuestionData.answers["multiple-choice"][0],
        currentQuestionData.answers["multiple-choice"][1],
      ];

      act(() => {
        handleSubmitMCAnswer(pupilAnswers);
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 0,
        feedback: ["correct", "incorrect", "incorrect", "correct"],
        offerHint: false,
        isPartiallyCorrect: true,
        pupilAnswer: [0, 1],
        correctAnswer: [
          "a sentence starter followed by a comma",
          "a group of words that contains a verb and makes complete sense",
        ],
      });
    });
  });

  describe("handleSubmitShortAnswer", () => {
    it("should grade a short answer as correct if the pupilAnswer is correct", () => {
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

      const { handleSubmitShortAnswer, currentQuestionData } = result.current;

      const answer =
        currentQuestionData?.answers?.["short-answer"]?.[0]?.answer[0];

      invariant(isText(answer), "answer is not a text answer");

      act(() => {
        handleSubmitShortAnswer(answer.text);
      });

      const { questionState } = result.current;

      expect(questionState[0]).toEqual({
        mode: "feedback",
        grade: 1,
        feedback: "correct",
        offerHint: false,
        correctAnswer: ["earth", "wind", "fire"],
        pupilAnswer: "earth",
      });
    });
  });

  it("should ignore case and whitespace when grading short answers", () => {
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

    const { handleSubmitShortAnswer } = result.current;

    act(() => {
      handleSubmitShortAnswer(" Earth ");
    });

    const { questionState } = result.current;

    expect(questionState[0]?.feedback).toEqual("correct");
  });

  it("should grade a short answer as incorrect if the pupilAnswer is incorrect", () => {
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
      correctAnswer: ["earth", "wind", "fire"],
      pupilAnswer: "this is not the correct answer",
    });
  });

  describe("handleSubmitOrderAnswer", () => {
    const orderQuestion = createQuestionData({
      answers: {
        order: orderAnswers,
      },
      questionType: "order",
    });

    it("should be graded as correct if items are in the correct order", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: [orderQuestion],
          }),
      });
      const { handleSubmitOrderAnswer } = result.current;

      act(() => {
        handleSubmitOrderAnswer([1, 2, 3, 4]);
      });

      const { questionState, currentQuestionIndex } = result.current;

      expect(questionState[currentQuestionIndex]?.grade).toEqual(1);
      expect(questionState[currentQuestionIndex]?.feedback).toEqual([
        "correct",
        "correct",
        "correct",
        "correct",
      ]);
      expect(questionState[currentQuestionIndex]?.mode).toEqual("feedback");
      expect(questionState[currentQuestionIndex]?.isPartiallyCorrect).toEqual(
        false,
      );
    });

    it("should be graded as incorrect if all items are not in the correct order", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: [orderQuestion],
          }),
      });
      const { handleSubmitOrderAnswer } = result.current;

      act(() => {
        handleSubmitOrderAnswer([2, 3, 4, 1]);
      });

      const { questionState, currentQuestionIndex } = result.current;

      expect(questionState[currentQuestionIndex]?.grade).toEqual(0);
      expect(questionState[currentQuestionIndex]?.feedback).toEqual([
        "incorrect",
        "incorrect",
        "incorrect",
        "incorrect",
      ]);
      expect(questionState[currentQuestionIndex]?.mode).toEqual("feedback");
      expect(questionState[currentQuestionIndex]?.isPartiallyCorrect).toEqual(
        false,
      );
    });

    it("should be graded as incorrect if some items are in the correct order", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: [orderQuestion],
          }),
      });
      const { handleSubmitOrderAnswer } = result.current;

      act(() => {
        handleSubmitOrderAnswer([1, 4, 3, 2]);
      });

      const { questionState, currentQuestionIndex } = result.current;

      expect(questionState[currentQuestionIndex]?.grade).toEqual(0);
      expect(questionState[currentQuestionIndex]?.feedback).toEqual([
        "correct",
        "incorrect",
        "correct",
        "incorrect",
      ]);
      expect(questionState[currentQuestionIndex]?.mode).toEqual("feedback");
      expect(questionState[currentQuestionIndex]?.isPartiallyCorrect).toEqual(
        true,
      );
    });
  });

  describe("handleSubmitMatchAnser", () => {
    const matchQuestion = createQuestionData({
      answers: {
        match: matchAnswers,
      },
      questionType: "match",
    });

    it("should be graded as correct if all choices are correct", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: [matchQuestion],
          }),
      });
      const { handleSubmitMatchAnswer } = result.current;

      act(() => {
        handleSubmitMatchAnswer(["0", "1", "2"], ["0", "1", "2"]);
      });

      const { questionState, currentQuestionIndex } = result.current;

      expect(questionState[currentQuestionIndex]?.grade).toEqual(1);
      expect(questionState[currentQuestionIndex]?.feedback).toEqual([
        "correct",
        "correct",
        "correct",
      ]);
      expect(questionState[currentQuestionIndex]?.mode).toEqual("feedback");
      expect(questionState[currentQuestionIndex]?.isPartiallyCorrect).toEqual(
        false,
      );
    });

    it("should be graded as incorrect if all choices are incorrect", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: [matchQuestion],
          }),
      });
      const { handleSubmitMatchAnswer } = result.current;

      act(() => {
        handleSubmitMatchAnswer(["0", "1"], ["1", "0"]);
      });

      const { questionState, currentQuestionIndex } = result.current;

      expect(questionState[currentQuestionIndex]?.grade).toEqual(0);
      expect(questionState[currentQuestionIndex]?.feedback).toEqual([
        "incorrect",
        "incorrect",
      ]);
      expect(questionState[currentQuestionIndex]?.mode).toEqual("feedback");
      expect(questionState[currentQuestionIndex]?.isPartiallyCorrect).toEqual(
        false,
      );
    });

    it("should be graded as incorrect if some choices are correct", () => {
      const { result } = renderHook(() => useQuizEngineContext(), {
        wrapper: (props) =>
          wrapper({
            ...props,
            questionsArray: [matchQuestion],
          }),
      });
      const { handleSubmitMatchAnswer } = result.current;

      act(() => {
        handleSubmitMatchAnswer(["0", "1", "2"], ["2", "1", "0"]);
      });

      const { questionState, currentQuestionIndex } = result.current;

      expect(questionState[currentQuestionIndex]?.grade).toEqual(0);
      expect(questionState[currentQuestionIndex]?.feedback).toEqual([
        "incorrect",
        "correct",
        "incorrect",
      ]);
      expect(questionState[currentQuestionIndex]?.mode).toEqual("feedback");
      expect(questionState[currentQuestionIndex]?.isPartiallyCorrect).toEqual(
        true,
      );
    });
  });
});

describe("useQuizEngineContext", () => {
  it("throws an error when there is no context", () => {
    vi.spyOn(console, "error").mockImplementation(() => vi.fn()); // suppress console.error
    expect(() => renderHook(() => useQuizEngineContext())).toThrow(
      "`QuizEngineProvider` is not available",
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});

// https://github.com/jsdom/jsdom/issues/3363
function structuredClone<T extends object>(incoming: T): T {
  return JSON.parse(JSON.stringify(incoming));
}
