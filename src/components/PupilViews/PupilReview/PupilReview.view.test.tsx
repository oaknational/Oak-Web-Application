import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useOakPupil } from "@oaknational/oak-pupil-client";
import userEvent from "@testing-library/user-event";

import { PupilViewsReview } from "./PupilReview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { PupilProvider } from "@/browser-lib/pupil-api/PupilClientProvider";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";


jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn((a) => a),
}));

Object.defineProperty(window, "open", {
  configurable: true,
  value: jest.fn(),
});

jest.mock("@oaknational/oak-pupil-client", () => ({
  ...jest.requireActual("@oaknational/oak-pupil-client"),
  useOakPupil: jest.fn(() => ({
    logAttempt: () => console.log("logAttempt"),
  })),
}));

describe("PupilReview", () => {
  it("displays the lesson title", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsReview
            lessonTitle="Lesson title"
            phase="secondary"
            exitQuizQuestionsArray={[]}
            starterQuizQuestionsArray={[]}
            lessonSlug="lesson-slug"
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            subjectTitle="subject-title"
            yearTitle="year-title"
            pageType="browse"
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Lesson title")).toBeInTheDocument();
  });
  it("displays the review item cards for intro, starter quiz, video, exit quiz", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsReview
            lessonTitle="Lesson title"
            phase="primary"
            exitQuizQuestionsArray={[]}
            starterQuizQuestionsArray={[]}
            lessonSlug="lesson-slug"
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            subjectTitle="subject-title"
            yearTitle="year-title"
            pageType="browse"
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByText("Introduction")).toBeInTheDocument();
    expect(getByText("Starter quiz")).toBeInTheDocument();
    expect(getByText("Lesson video")).toBeInTheDocument();
    expect(getByText("Exit quiz")).toBeInTheDocument();
  });
  it("displays the lesson overview button", () => {
    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsReview
            lessonTitle="Lesson title"
            exitQuizQuestionsArray={[]}
            starterQuizQuestionsArray={[]}
            lessonSlug="lesson-slug"
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            subjectTitle="subject-title"
            yearTitle="year-title"
            pageType="browse"
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );
    expect(getByRole("link", { name: /Lesson overview/i })).toBeInTheDocument();
  });

  it("displays a special message when the lesson is complete", () => {
    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({ isLessonComplete: true })}
        >
          <PupilViewsReview
            lessonTitle="Lesson title"
            exitQuizQuestionsArray={[]}
            starterQuizQuestionsArray={[]}
            lessonSlug="lesson-slug"
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            subjectTitle="subject-title"
            yearTitle="year-title"
            pageType="browse"
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(queryByText("Fantastic job - well done!")).toBeInTheDocument();
  });
  describe("should display print Share lesson results button", () => {
    it("should not display the print button when the feature flag is disabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(false);
      const { queryByRole } = renderWithTheme(
        <PupilProvider>
          {" "}
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider value={createLessonEngineContext()}>
              <PupilViewsReview
                lessonTitle="Lesson title"
                exitQuizQuestionsArray={[]}
                starterQuizQuestionsArray={[]}
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                subjectTitle="subject-title"
                yearTitle="year-title"
                pageType="browse"
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </PupilProvider>,
      );

      expect(
        queryByRole("button", { name: "Share lesson results" }),
      ).not.toBeInTheDocument();
    });
    it("should display the print button when the feature flag is enabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const { getByRole } = renderWithTheme(
        <PupilProvider>
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider value={createLessonEngineContext()}>
              <PupilViewsReview
                lessonTitle="Lesson title"
                exitQuizQuestionsArray={[]}
                starterQuizQuestionsArray={[]}
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                subjectTitle="subject-title"
                yearTitle="year-title"
                pageType="browse"
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </PupilProvider>,
      );

      expect(
        getByRole("button", { name: "Share lesson results" }),
      ).toBeInTheDocument();
    });
    it("logAttempt function is called when button is clicked", async () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      //spy on the track function
      const logAttemptSpy = jest.fn();
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
            })}
          >
            {" "}
            <PupilProvider>
              <PupilViewsReview
                lessonTitle="Lesson title"
                exitQuizQuestionsArray={[]}
                starterQuizQuestionsArray={[]}
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                subjectTitle="subject-title"
                yearTitle="year-title"
                pageType="browse"
              />
            </PupilProvider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      const button = getByRole("button", { name: "Share lesson results" });
      await userEvent.click(button).then(() => {
        expect(logAttemptSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
