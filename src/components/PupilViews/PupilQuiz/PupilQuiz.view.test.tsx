import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";

import { PupilViewsQuiz } from "./PupilQuiz.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";

const questionsArrayFixture = quizQuestions || [];

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

describe("PupilQuizView", () => {
  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const heading = getByText("Starter Quiz");
    expect(heading).toBeInTheDocument();
  });

  it("disables submit button when mode is init", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Submit").closest("button")).toBeDisabled();
  });

  it("renders Next button when questionState.mode is feedback", () => {
    const { getByText, getByLabelText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByLabelText(/a group of letters/));
      fireEvent.click(getByRole("button", { name: "Submit" }));
    });
    expect(getByText("Next question").closest("button")).toBeInTheDocument();
  });

  it("does not render Next button when questionState.mode is not feedback", () => {
    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText("Next Question")).not.toBeInTheDocument();
  });
});
