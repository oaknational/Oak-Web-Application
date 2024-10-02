import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakPupilClientProvider,
  useOakPupil,
} from "@oaknational/oak-pupil-client";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import { PupilViewsReview } from "./PupilReview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn((a) => a),
}));

Object.defineProperty(window, "open", {
  configurable: true,
  value: jest.fn(),
});

jest.mock("@oaknational/oak-pupil-client", () => ({
  ...jest.requireActual("@oaknational/oak-pupil-client"),
  OakPupilClientProvider: jest.fn(({ children }) => children),
  useOakPupil: jest.fn(() => ({
    logAttempt: () => console.log("logAttempt"),
  })),
}));

const mockBroweData = lessonBrowseDataFixture({
  programmeFields: {
    ...lessonBrowseDataFixture({}).programmeFields,
    yearDescription: "Year 1",
  },
});

describe("PupilReview", () => {
  it("error messages when the phase is foundation", () => {
    const mockBrowseDataWithFoundation = lessonBrowseDataFixture({
      ...mockBroweData,
      programmeFields: {
        ...lessonBrowseDataFixture({}).programmeFields,
        phase: "foundation",
      },
    });
    expect(() =>
      renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsReview
              lessonTitle="Lesson title"
              exitQuizQuestionsArray={[]}
              starterQuizQuestionsArray={[]}
              browseData={mockBrowseDataWithFoundation}
              unitSlug="unit-slug"
              programmeSlug="programme-slug"
              pageType="browse"
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      ),
    ).toThrow("Foundation phase is not supported");
  });
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
  describe("Printable results button", () => {
    it("should not display the print button when the feature flag is disabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(false);
      const { queryByText } = renderWithTheme(
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

      expect(queryByText("Printable results")).not.toBeInTheDocument();
    });
    it("should display the print button when the feature flag is enabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const { queryByText } = renderWithTheme(
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

      expect(queryByText("Printable results")).toBeInTheDocument();
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
  describe("Copy link button", () => {
    it("should not display the print button when the feature flag is disabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(false);
      const { queryByText } = renderWithTheme(
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

      expect(queryByText("Copy link")).not.toBeInTheDocument();
    });
    it("should display the print button when the feature flag is enabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const { queryByText } = renderWithTheme(
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

      expect(queryByText("Copy link")).toBeInTheDocument();
    });
    it("logAttempt function is called when button is clicked", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      //spy on the track function
      const logAttemptSpy = jest.fn(() => "some-attempt-id");
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      const { getByText } = renderWithTheme(
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
      const button = getByText("Copy link");
      // Simulate the button click
      act(() => {
        button.click(); // Manually trigger click
      });

      // Assert that logAttempt has been called once
      expect(logAttemptSpy).toHaveBeenCalledTimes(1);
    });
    it("throws error if promise returns null", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      //spy on the track function
      const logAttemptSpy = jest.fn(() => ({
        promise: Promise.reject(new Error("Test error")), // Simulate a rejected promise
        attemptId: "some-attempt-id",
      }));
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });
      // Mock console.error

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { getByText } = renderWithTheme(
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

      consoleErrorSpy.mockRestore();

      const button = getByText("Copy link");

      userEvent.click(button).then(() => {
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error sharing results: Test error",
        );
      });
    });
    it("copies the correct url to the clipboard when logAttempt returns a promise", () => {
      // Enable the feature flag
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const logAttemptSpy = jest.fn(() => ({
        promise: Promise.reject(new Error("Test error")),
        attemptId: "some-attempt-id",
      }));

      // Mock useOakPupil to return an object with logAttempt
      (useOakPupil as jest.Mock).mockReturnValue({
        logAttempt: logAttemptSpy,
      });
      // Render the component
      const { getByText } = renderWithTheme(
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

      // Find the button and log its presence
      const button = getByText("Copy link");
      expect(button).toBeInTheDocument(); // Ensure the button exists

      // Simulate the button click
      act(() => {
        button.click(); // Manually trigger click
      });

      // Assert that logAttempt has been called once
      expect(logAttemptSpy).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "http://localhost:3000/pupils/lessons/lesson-slug/results/some-attempt-id/share",
      );
    });
    it("copies correct url to clipboard when logAttempt returns a string", () => {
      // Enable the feature flag
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const logAttemptSpy = jest.fn(() => "some-attempt-id");

      // Mock useOakPupil to return an object with logAttempt
      (useOakPupil as jest.Mock).mockReturnValue({
        logAttempt: logAttemptSpy,
      });
      // Render the component
      const { getByText } = renderWithTheme(
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

      // Find the button and log its presence
      const button = getByText("Copy link");
      expect(button).toBeInTheDocument(); // Ensure the button exists

      // Simulate the button click
      act(() => {
        button.click(); // Manually trigger click
      });

      // Assert that logAttempt has been called once
      expect(logAttemptSpy).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "http://localhost:3000/pupils/lessons/lesson-slug/results/some-attempt-id/share",
      );
    });
  });
});
