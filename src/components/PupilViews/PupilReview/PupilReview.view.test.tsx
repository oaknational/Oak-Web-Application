import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakPupilClientProvider,
  useOakPupil,
} from "@oaknational/oak-pupil-client";
import userEvent from "@testing-library/user-event";

import { PupilViewsReview } from "./PupilReview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

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

const mockBroweData = lessonBrowseDataFixture({});

describe("PupilReview", () => {
  it("displays the lesson title", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsReview
            lessonTitle="Lesson title"
            exitQuizQuestionsArray={[]}
            starterQuizQuestionsArray={[]}
            browseData={mockBroweData}
            unitSlug="unit-slug"
            programmeSlug="programme-slug"
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
            exitQuizQuestionsArray={[]}
            starterQuizQuestionsArray={[]}
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            pageType="browse"
            browseData={mockBroweData}
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
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            pageType="browse"
            browseData={mockBroweData}
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
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            pageType="browse"
            browseData={mockBroweData}
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
        <OakPupilClientProvider
          config={{
            getLessonAttemptUrl: "example.com",
            logLessonAttemptUrl: "example.com",
          }}
        >
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider value={createLessonEngineContext()}>
              <PupilViewsReview
                lessonTitle="Lesson title"
                exitQuizQuestionsArray={[]}
                starterQuizQuestionsArray={[]}
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                pageType="browse"
                browseData={mockBroweData}
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </OakPupilClientProvider>,
      );

      expect(
        queryByRole("button", { name: "Share lesson results" }),
      ).not.toBeInTheDocument();
    });
    it("should display the print button when the feature flag is enabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const { getByTestId } = renderWithTheme(
        <OakPupilClientProvider
          config={{
            getLessonAttemptUrl: "example.com",
            logLessonAttemptUrl: "example.com",
          }}
        >
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider value={createLessonEngineContext()}>
              <PupilViewsReview
                lessonTitle="Lesson title"
                exitQuizQuestionsArray={[]}
                starterQuizQuestionsArray={[]}
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                browseData={mockBroweData}
                pageType="browse"
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </OakPupilClientProvider>,
      );

      expect(getByTestId("printable-results-button")).toBeInTheDocument();
    });
    it("logAttempt function is called when button is clicked", async () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      //spy on the track function
      const logAttemptSpy = jest.fn(() => Promise.resolve("attempt-id"));
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      const { getByTestId } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
            })}
          >
            <OakPupilClientProvider
              config={{
                getLessonAttemptUrl: "example.com",
                logLessonAttemptUrl: "example.com",
              }}
            >
              <PupilViewsReview
                lessonTitle="Lesson title"
                exitQuizQuestionsArray={[]}
                starterQuizQuestionsArray={[]}
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                browseData={mockBroweData}
                pageType="browse"
              />
            </OakPupilClientProvider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      const button = getByTestId("printable-results-button");
      await userEvent.click(button).then(() => {
        expect(logAttemptSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
