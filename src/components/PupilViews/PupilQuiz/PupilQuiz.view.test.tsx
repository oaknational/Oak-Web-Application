import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";
import { ValueOf } from "next/dist/shared/lib/constants";

import { PupilViewsQuiz } from "./PupilQuiz.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  matchAnswers,
  mcqCorrectAnswer,
  mcqIncorrectAnswer,
  mcqTextAnswers,
  orderAnswers,
  quizQuestions,
  shortAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import {
  LessonEngineContext,
  LessonSection,
} from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { AnswersSchema } from "@/node-lib/curriculum-api-2023/shared.schema";

jest.mock("@oaknational/oak-components", () => {
  return {
    ...jest.requireActual("@oaknational/oak-components"),
    OakQuizMatch: () => null,
    OakQuizOrder: () => null,
  };
});

describe("PupilQuizView", () => {
  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const heading = getByText("Starter Quiz");
    expect(heading).toBeInTheDocument();
  });

  it("renders Next button when questionState.mode is feedback", () => {
    const { getByLabelText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByLabelText(/a group of letters/));
      fireEvent.click(getByRole("button", { name: /Check/ }));
    });
    expect(getByRole("button", { name: /Next question/ })).toBeInTheDocument();
  });

  it("does not render Next button when questionState.mode is not feedback", () => {
    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={quizQuestions} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText(/Next Question/)).not.toBeInTheDocument();
  });

  it.each([
    ["exit-quiz", /Lesson review/],
    ["starter-quiz", /Continue lesson/],
  ] satisfies Array<[LessonSection, RegExp]>)(
    "for the %p section the button label for the last question is %p",
    (currentSection, label) => {
      const { getByLabelText, getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({ currentSection })}
          >
            <PupilViewsQuiz questionsArray={quizQuestions.slice(0, 1)} />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByLabelText(/a group of letters/));
        fireEvent.click(getByRole("button", { name: /Check/ }));
      });

      expect(getByRole("button", { name: label })).toBeInTheDocument();
    },
  );

  it.each([
    ["short-answer", shortAnswers, "You need to type an answer to move on!"],
    [
      "multiple-choice",
      mcqTextAnswers,
      "You need to select an answer to move on!",
    ],
    [
      "multiple-choice",
      [mcqCorrectAnswer, mcqCorrectAnswer, mcqIncorrectAnswer],
      "You need to select answers to move on!",
    ],
    ["order", orderAnswers, "You need to order to move on!"],
    ["match", matchAnswers, "You need to match to move on!"],
  ] satisfies Array<[keyof AnswersSchema, ValueOf<AnswersSchema>, string]>)(
    "displays a tooltip for the %p question type when it is incomplete",
    (questionType, answers, tooltipText) => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsQuiz
              questionsArray={[
                {
                  questionId: 1,
                  questionUid: "test-question",
                  questionType,
                  questionStem: [],
                  feedback: "",
                  hint: "",
                  active: true,
                  answers: {
                    [questionType]: answers,
                  },
                },
              ]}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      act(() => {
        fireEvent.click(getByRole("button", { name: /Check/ }));
      });

      expect(getByRole("tooltip")).toHaveTextContent(tooltipText);
    },
  );
});
