import { describe, expect, it, vi } from "vitest";
import { act, fireEvent } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";

import { QuizShortAnswer } from "./QuizShortAnswer";

import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const shortAnswerQuestion = quizQuestions?.find(
  (q) => q.answers?.["short-answer"] && q.answers?.["short-answer"].length > 0,
);

const getContext = (): NonNullable<QuizEngineContextType> => ({
  currentQuestionData: shortAnswerQuestion,
  currentQuestionIndex: 0,
  questionState: [
    {
      mode: "init",
      offerHint: false,
      grade: 0,
    },
  ],
  updateQuestionMode: vi.fn(),
  handleSubmitMCAnswer: vi.fn(),
  handleNextQuestion: vi.fn(),
  handleSubmitShortAnswer: vi.fn(),
  score: 0,
  numQuestions: 1,
});

describe("QuizShortAnswer", () => {
  it("renders a text input", () => {
    const context = getContext();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizShortAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("calls onInitialChange when there is user input", () => {
    const context = getContext();
    const onInitialChange = vi.fn();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizShortAnswer onInitialChange={onInitialChange} />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      const input = getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });
    });

    expect(onInitialChange).toHaveBeenCalled();
  });

  it("sets the name to the `short-answer-${questionUid}`", () => {
    const context = getContext();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizShortAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const input = getByRole("textbox");
    expect(input).toHaveAttribute(
      "name",
      `short-answer-${shortAnswerQuestion?.questionUid}`,
    );
  });

  it("renders feedback when in feedback mode", () => {
    const context = getContext();

    if (!context.questionState[0]) {
      throw new Error("questionState[0] is undefined");
    }

    context.questionState[0].mode = "feedback";
    context.questionState[0].feedback = "correct";

    const { getByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizShortAnswer />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    const feedback = getByAltText(/correct/i);
    expect(feedback).toBeInTheDocument();
  });
});
