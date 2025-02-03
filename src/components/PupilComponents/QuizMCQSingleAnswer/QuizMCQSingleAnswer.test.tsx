import { vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act } from "@testing-library/react";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";
import { LessonEngineContext } from "../LessonEngineProvider";
import { createLessonEngineContext } from "../pupilTestHelpers/createLessonEngineContext";

import { QuizMCQSingleAnswer } from "./QuizMCQSingleAnswer";

import {
  QuizEngineContextType,
  QuizEngineContext,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  quizQuestions,
  mcqTextAnswers,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { isText } from "@/components/PupilComponents/QuizUtils/stemUtils";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

vi.mock("@oaknational/oak-components", async () => {
  const oakComponents = await vi.importActual("@oaknational/oak-components");
  return {
    ...oakComponents,
    OakScaleImageButton: ({
      onImageScaleCallback,
      isExpanded,
    }: {
      onImageScaleCallback: (e: React.MouseEvent<HTMLButtonElement>) => void;
      isExpanded: boolean;
    }) => {
      return (
        <button
          role="button"
          type="button"
          onClick={(e) => {
            onImageScaleCallback(e);
          }}
        >
          {!isExpanded ? "expand" : "minimize"}
        </button>
      );
    },
  };
});

const questionsArrayFixture = quizQuestions || [];

const getContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: questionsArrayFixture[0],
    numQuestions: 1,
  });

describe("QuizMCQSingleAnswer", () => {
  const singleMcqTextAnswers = [...mcqTextAnswers];

  const singleMcqImageAnswers = [...mcqImageAnswers];

  // Make multiple answers correct
  if (singleMcqTextAnswers[0]) {
    singleMcqTextAnswers[0].answerIsCorrect = true;
  }

  if (singleMcqImageAnswers[0]) {
    singleMcqImageAnswers[0].answerIsCorrect = true;
  }
  // mock the QuizEngineContext
  const mockQuizEngineContext: NonNullable<QuizEngineContextType> =
    createQuizEngineContext({
      currentQuestionData: {
        questionUid: "test",
        questionId: 0,
        questionType: "multiple-choice",
        order: 0,
        questionStem: [
          {
            type: "text",
            text: "Test question",
          },
        ],
        answers: { "multiple-choice": singleMcqTextAnswers },
        feedback: "",
        hint: "",
        active: true,
      },

      currentQuestionIndex: 0,
      questionState: [
        {
          mode: "input",
          grade: 0,
          offerHint: false,
        },
      ],
    });

  const mockQuizEngineContextWithImageAnswers: QuizEngineContextType = {
    ...mockQuizEngineContext,
    currentQuestionData: {
      ...(mockQuizEngineContext.currentQuestionData as QuizQuestion),
      answers: { "multiple-choice": singleMcqImageAnswers },
    },
  };
  it("renders the question answers", () => {
    const context = getContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={context}>
            <QuizMCQSingleAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    if (context.currentQuestionData?.answers?.["multiple-choice"]) {
      for (const answer of context.currentQuestionData.answers[
        "multiple-choice"
      ]) {
        for (const t of answer.answer) {
          if (isText(t)) {
            const answerText = getByText(t.text);
            expect(answerText).toBeInTheDocument();
          }
        }
      }
    }
  });
  it("renders images when they are present in the answers", () => {
    const { getAllByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider
            value={mockQuizEngineContextWithImageAnswers}
          >
            <QuizMCQSingleAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    const images = getAllByRole("presentation"); // NB. Images are currently unnamed but this will need to be replaced with alt text based search
    expect(images.length).toEqual(mcqImageAnswers.length);
  });
  it("sets scaled to true if the image expand button is clicked", () => {
    const { getAllByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <QuizEngineContext.Provider
            value={mockQuizEngineContextWithImageAnswers}
          >
            <QuizMCQSingleAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const expandButtons = getAllByText("expand");
    const firstExpandButton = expandButtons[0];
    act(() => {
      firstExpandButton?.click(); // Manually trigger click
    });
  });
});
