import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsReview } from "./PupilReview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";

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

describe("PupilReview", () => {
  it("displays the lesson title", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsReview lessonTitle="Lesson title" />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Lesson title")).toBeInTheDocument();
  });
  it("displays the review item cards for intro, starter quiz, video, exit quiz", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsReview lessonTitle="Lesson title" />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Intro")).toBeInTheDocument();
    expect(getByText("Starter quiz")).toBeInTheDocument();
    expect(getByText("Watch video")).toBeInTheDocument();
    expect(getByText("Exit quiz")).toBeInTheDocument();
  });
  it("displays the lesson overview button", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={getLessonEngineContext()}>
          <PupilViewsReview lessonTitle="Lesson title" />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(
      getByRole("button", { name: /Lesson overview/i }),
    ).toBeInTheDocument();
  });
});
