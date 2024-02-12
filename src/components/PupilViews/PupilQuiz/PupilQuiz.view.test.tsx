import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { act, fireEvent } from "@testing-library/react";

import { PupilViewsQuiz } from "./PupilQuiz.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider/LessonEngineProvider.test";

const questionsArrayFixture = quizQuestions || [];

describe("PupilQuizView", () => {
  it("renders heading, mode and answer when there is currentQuestionData", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    const heading = getByText("Starter Quiz");
    expect(heading).toBeInTheDocument();
  });

  it("disables submit button when mode is init", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("renders Next button when questionState.mode is feedback", () => {
    const { getByLabelText, getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByLabelText(/a group of letters/)).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByLabelText(/a group of letters/));
      fireEvent.click(getByRole("button", { name: "Submit" }));
    });
    expect(getByRole("button", { name: "Next question" })).toBeInTheDocument();
  });

  it("does not render Next button when questionState.mode is not feedback", () => {
    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsQuiz questionsArray={questionsArrayFixture ?? []} />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(queryByText("Next Question")).not.toBeInTheDocument();
  });
});
