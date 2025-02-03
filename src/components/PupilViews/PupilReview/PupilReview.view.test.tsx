import { Mock, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
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
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";

const writeText = vi.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

Object.defineProperty(window, "open", {
  configurable: true,
  value: vi.fn(),
});

vi.mock("@oaknational/oak-pupil-client", async () => ({
  ...(await vi.importActual("@oaknational/oak-pupil-client")),
  OakPupilClientProvider: vi.fn(({ children }) => children),
  useOakPupil: vi.fn(() => ({
    logAttempt: () => console.log("logAttempt"),
  })),
}));

const mockBroweData = lessonBrowseDataFixture({
  programmeFields: {
    ...lessonBrowseDataFixture({}).programmeFields,
    yearDescription: "Year 1",
  },
});

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, vi.fn()])),
  identify: vi.fn(),
  posthogDistinctId: "123",
};

vi.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

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
    const logAttemptSpy = vi.fn(() => Promise.resolve("attempt-id"));
    (useOakPupil as Mock).mockReturnValue({ logAttempt: logAttemptSpy });

    const { getByText } = renderWithTheme(
      <OakPupilClientProvider
        config={{
          getLessonAttemptUrl: "example.com",
          logLessonAttemptUrl: "example.com",
          getTeacherNoteUrl: "example.com",
          addTeacherNoteUrl: "example.com",
        }}
      >
        {" "}
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              isLessonComplete: true,
              sectionResults: sectionResultsFixture,
            })}
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
        </OakThemeProvider>
      </OakPupilClientProvider>,
    );

    expect(getByText("Great effort!")).toBeInTheDocument();
  });

  describe("Copy link button", () => {
    it("should display the print button", () => {
      const { queryByText } = renderWithTheme(
        <OakPupilClientProvider
          config={{
            getLessonAttemptUrl: "example.com",
            logLessonAttemptUrl: "example.com",
            getTeacherNoteUrl: "example.com",
            addTeacherNoteUrl: "example.com",
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
      //spy on the track function
      const logAttemptSpy = vi.fn(() => "some-attempt-id");
      (useOakPupil as Mock).mockReturnValue({ logAttempt: logAttemptSpy });

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
                getTeacherNoteUrl: "example.com",
                addTeacherNoteUrl: "example.com",
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
    it("throws error if promise returns null", async () => {
      const logAttemptSpy = vi.fn(() => ({
        promise: Promise.reject(new Error("Test error")),
        attemptId: "some-attempt-id",
      }));
      (useOakPupil as Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
              isLessonComplete: false,
            })}
          >
            <OakPupilClientProvider
              config={{
                getLessonAttemptUrl: "example.com",
                logLessonAttemptUrl: "example.com",
                getTeacherNoteUrl: "example.com",
                addTeacherNoteUrl: "example.com",
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

      // Use await to properly wait for the click and promise rejection (bug here)
      await userEvent.click(button);

      // Move assertions before spy restoration
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Test error"));

      // Restore the spy after assertions
      consoleErrorSpy.mockRestore();
    });
    it("copies the correct url to the clipboard when logAttempt returns a promise", () => {
      const logAttemptSpy = vi.fn(() => ({
        promise: Promise.reject(new Error("Test error")),
        attemptId: "some-attempt-id",
      }));

      // Mock useOakPupil to return an object with logAttempt
      (useOakPupil as Mock).mockReturnValue({
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
                getTeacherNoteUrl: "example.com",
                addTeacherNoteUrl: "example.com",
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
      const logAttemptSpy = vi.fn(() => "some-attempt-id");

      // Mock useOakPupil to return an object with logAttempt
      (useOakPupil as Mock).mockReturnValue({
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
                getTeacherNoteUrl: "example.com",
                addTeacherNoteUrl: "example.com",
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
  describe("Printable results button", () => {
    it("should display the print button and log attempt after timeout", () => {
      // Mock the logAttempt function
      const logAttemptSpy = vi.fn(() => "attempt-id");
      (useOakPupil as Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      // Render the component
      const { getByText } = renderWithTheme(
        <OakPupilClientProvider
          config={{
            getLessonAttemptUrl: "example.com",
            logLessonAttemptUrl: "example.com",
            getTeacherNoteUrl: "example.com",
            addTeacherNoteUrl: "example.com",
          }}
        >
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider
              value={createLessonEngineContext({
                sectionResults: sectionResultsFixture,
                isLessonComplete: true, // Ensure lesson is complete to trigger the effect
              })}
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
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </OakPupilClientProvider>,
      );

      // Fast-forward and exhaust all timers to ensure the setTimeout callback is executed
      // jest.runOnlyPendingTimers();

      // Check if the logAttempt function was called
      expect(logAttemptSpy).toHaveBeenCalledTimes(1); // Ensure it's called once

      // Check that the print button is displayed
      expect(getByText("Printable results")).toBeInTheDocument();
    });

    it("Printable results link takes you to correct printable results page", async () => {
      const logAttemptSpy = vi.fn(() => "attempt-id");
      vi.mocked(useOakPupil).mockReturnValue({ logAttempt: logAttemptSpy });
      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
              isLessonComplete: true,
            })}
          >
            <OakPupilClientProvider
              config={{
                getLessonAttemptUrl: "example.com",
                logLessonAttemptUrl: "example.com",
                getTeacherNoteUrl: "example.com",
                addTeacherNoteUrl: "example.com",
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

      expect(logAttemptSpy).toHaveBeenCalledTimes(1);
      expect(getByText("Printable results").closest("a")).toHaveAttribute(
        "href",
        "/pupils/lessons/lesson-slug/results/attempt-id/printable",
      );
    });
  });
});
