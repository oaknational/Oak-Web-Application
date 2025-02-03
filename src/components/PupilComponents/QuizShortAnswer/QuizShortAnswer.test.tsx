import React from "react";
import "@testing-library/jest-dom";
import { act, fireEvent } from "@testing-library/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizShortAnswer } from "./QuizShortAnswer";

import { createQuizEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createQuizEngineContext";
import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";

const shortAnswerQuestion = quizQuestions?.find(
  (q) => q.answers?.["short-answer"] && q.answers?.["short-answer"].length > 0,
);

const getContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: shortAnswerQuestion,
    numQuestions: 1,
  });

describe("QuizShortAnswer", () => {
  it("renders a text input", () => {
    const context = getContext();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={context}>
            <QuizShortAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    const input = getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("calls onChange when there is user input", () => {
    const context = getContext();
    const onChange = vi.fn();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={context}>
            <QuizShortAnswer onChange={onChange} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    act(() => {
      const input = getByRole("textbox");
      fireEvent.change(input, { target: { value: "test" } });
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("sets the name to the `short-answer-${questionUid}`", () => {
    const context = getContext();

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={context}>
            <QuizShortAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
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
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={context}>
            <QuizShortAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    const feedback = getByAltText(/correct/i);
    expect(feedback).toBeInTheDocument();
  });
});
