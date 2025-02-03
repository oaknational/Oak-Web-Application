import { vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act } from "@testing-library/react";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import { createQuizEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createQuizEngineContext";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  mcqTextAnswers,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

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

describe("QuizMCQMultiAnswer", () => {
  const multiMcqTextAnswers = [...mcqTextAnswers];

  const multiMcqImageAnswers = [...mcqImageAnswers];

  // Make multiple answers correct
  if (multiMcqTextAnswers[0]) {
    multiMcqTextAnswers[0].answerIsCorrect = true;
  }
  if (multiMcqTextAnswers[2]) {
    multiMcqTextAnswers[2].answerIsCorrect = true;
  }

  if (multiMcqImageAnswers[0]) {
    multiMcqImageAnswers[0].answerIsCorrect = true;
  }
  if (multiMcqImageAnswers[2]) {
    multiMcqImageAnswers[2].answerIsCorrect = true;
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
        answers: { "multiple-choice": multiMcqTextAnswers },
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
      answers: { "multiple-choice": multiMcqImageAnswers },
    },
  };

  it("renders the answers", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={mockQuizEngineContext}>
            <QuizMCQMultiAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      if (answer.answer?.[0]?.type === "text") {
        expect(getByText(answer.answer[0].text)).toBeInTheDocument();
      }
    }
  });

  it("renders the answers as clickable in input mode", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={mockQuizEngineContext}>
            <QuizMCQMultiAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      if (answer.answer?.[0]?.type === "text") {
        getByRole("checkbox", { name: answer.answer[0].text }).click();
        expect(
          getByRole("checkbox", { name: answer.answer[0].text }),
        ).toBeChecked();
      }
    }
  });

  it("renders the answers as unclickable in feedback mode", () => {
    const mockQuizEngineContextFeedback: QuizEngineContextType = {
      ...mockQuizEngineContext,
      questionState: [
        {
          mode: "feedback",
          grade: 0,
          offerHint: false,
          feedback: ["correct", "correct", "correct", "correct"],
        },
      ],
    };

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          {" "}
          <QuizEngineContext.Provider value={mockQuizEngineContextFeedback}>
            <QuizMCQMultiAnswer onChange={() => {}} />
          </QuizEngineContext.Provider>
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      if (answer.answer?.[0]?.type === "text") {
        expect(
          getByRole("checkbox", { name: answer.answer[0].text }),
        ).toBeDisabled();

        getByRole("checkbox", { name: answer.answer[0].text }).click();
        expect(
          getByRole("checkbox", { name: answer.answer[0].text }),
        ).not.toBeChecked();
      }
    }
  });

  it("renders images when they are present in the answers", () => {
    const { getAllByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <QuizEngineContext.Provider
            value={mockQuizEngineContextWithImageAnswers}
          >
            <QuizMCQMultiAnswer onChange={() => {}} />
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
            <QuizMCQMultiAnswer onChange={() => {}} />
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
