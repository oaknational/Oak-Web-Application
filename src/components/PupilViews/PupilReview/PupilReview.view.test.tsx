import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import { PupilViewsReview } from "./PupilReview.view";

import { useOakPupil } from "@/hooks/useOakPupil";
import { OakPupilClientProvider } from "@/context/Pupil/OakPupilClientProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { trackingEvents } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";

const mockUseSearchParams = jest.fn().mockReturnValue(null);

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockUseSearchParams(),
}));

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  turnInCourseWork: jest.fn().mockResolvedValue(undefined),
}));

const mockTurnInCourseWork = googleClassroomApi.turnInCourseWork as jest.Mock;

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});

Object.defineProperty(window, "open", {
  configurable: true,
  value: jest.fn(),
});

jest.mock("@/hooks/useOakPupil", () => ({
  ...jest.requireActual("@/hooks/useOakPupil"),
  useOakPupil: jest.fn(() => ({
    logAttempt: () => console.log("logAttempt"),
  })),
}));

jest.mock("@/context/Pupil/OakPupilClientProvider", () => ({
  ...jest.requireActual("@/context/Pupil/OakPupilClientProvider"),
  OakPupilClientProvider: jest.fn(({ children }) => children),
}));

const mockBroweData = lessonBrowseDataFixture({
  programmeFields: {
    ...lessonBrowseDataFixture({}).programmeFields,
    yearDescription: "Year 1",
  },
});

const usePupilAnalyticsMock = {
  track: Object.fromEntries(trackingEvents.map((event) => [event, jest.fn()])),
  identify: jest.fn(),
  posthogDistinctId: "123",
};

jest.mock(
  "@/components/PupilComponents/PupilAnalyticsProvider/usePupilAnalytics",
  () => {
    return {
      usePupilAnalytics: () => usePupilAnalyticsMock,
    };
  },
);

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: jest.fn().mockReturnValue({
    isClassroomAssignment: false,
    classroomAssignmentChecked: true,
  }),
}));

describe("PupilReview", () => {
  it("error messages when the phase is foundation", () => {
    console.error = jest.fn();
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
    const consoleErrorCalls = (console.error as ReturnType<typeof jest.fn>).mock
      .calls;
    expect(consoleErrorCalls[0]?.[0].message).toEqual(
      "Uncaught [Error: Foundation phase is not supported]",
    );
    expect(consoleErrorCalls[1]?.[0].message).toEqual(
      "Uncaught [Error: Foundation phase is not supported]",
    );
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
    const logAttemptSpy = jest.fn(() => Promise.resolve("attempt-id"));
    (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

    const { getByText } = renderWithTheme(
      <OakPupilClientProvider>
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
        <OakPupilClientProvider>
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
    it("logAttempt function is called when button is clicked", async () => {
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
            <OakPupilClientProvider>
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
      await userEvent.click(button);

      // Assert that logAttempt has been called once
      expect(logAttemptSpy).toHaveBeenCalledTimes(1);
    });
    it("throws error if promise returns null", async () => {
      //spy on the track function
      const logAttemptSpy = jest.fn(() => ({
        promise: Promise.reject(new Error("Test error")), // Simulate a rejected promise
        attemptId: "some-attempt-id",
      }));
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
              isLessonComplete: false,
            })}
          >
            <OakPupilClientProvider>
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

      // Mock the console.error function just prior to the button click
      console.error = jest.fn();

      await userEvent.click(button);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(new Error("Test error"));

      // Restore the console.error function
      (console.error as ReturnType<typeof jest.fn>).mockRestore();
    });
    it("copies the correct url to the clipboard when logAttempt returns a promise", async () => {
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
            <OakPupilClientProvider>
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
      await userEvent.click(button);

      // Assert that logAttempt has been called once
      expect(logAttemptSpy).toHaveBeenCalledTimes(1);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "http://localhost:3000/pupils/lessons/lesson-slug/results/some-attempt-id/share",
      );
    });
    it("copies correct url to clipboard when logAttempt returns a string", async () => {
      // Enable the feature flag
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
            <OakPupilClientProvider>
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
      await userEvent.click(button);

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
      const logAttemptSpy = jest.fn(() => "attempt-id");
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      // Render the component
      const { getByText } = renderWithTheme(
        <OakPupilClientProvider>
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
      const logAttemptSpy = jest.fn(() => "attempt-id");
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });
      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
              isLessonComplete: true,
            })}
          >
            <OakPupilClientProvider>
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

  describe("CourseWork hand-in", () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue(
        new URLSearchParams("assignmentToken=test-token"),
      );
      mockTurnInCourseWork.mockResolvedValue(undefined);
    });

    afterEach(() => {
      mockUseSearchParams.mockReturnValue(null);
    });

    it("shows the hand-in button when an assignmentToken is present", () => {
      const { getByText } = renderWithTheme(
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
        </OakThemeProvider>,
      );

      expect(getByText("Hand in")).toBeInTheDocument();
    });

    it("shows a loading spinner and updated label while handing in", async () => {
      mockTurnInCourseWork.mockReturnValue(new Promise(() => {})); // never resolves

      const { getByText, getByRole } = renderWithTheme(
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
        </OakThemeProvider>,
      );

      await userEvent.click(getByText("Hand in"));

      expect(getByText("Handing in…")).toBeInTheDocument();
      expect(getByRole("button", { name: /Handing in/i })).toBeDisabled();
    });

    it("shows a success message and disables the button after handing in", async () => {
      const { getByText, getByRole } = renderWithTheme(
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
        </OakThemeProvider>,
      );

      await userEvent.click(getByText("Hand in"));

      expect(
        getByText("Assignment handed in successfully!"),
      ).toBeInTheDocument();
      expect(getByText("Handed in")).toBeInTheDocument();
      expect(getByRole("button", { name: /Handed in/i })).toBeDisabled();
    });

    it("shows an error message when hand-in fails", async () => {
      mockTurnInCourseWork.mockRejectedValueOnce(new Error("Network error"));

      const { getByText } = renderWithTheme(
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
        </OakThemeProvider>,
      );

      await userEvent.click(getByText("Hand in"));

      expect(
        getByText("Failed to hand in. Please try again."),
      ).toBeInTheDocument();
      expect(getByText("Hand in")).toBeInTheDocument();
    });
  });

  describe("isReadOnly mode", () => {
    it("hides the lesson overview link when isReadOnly is true", () => {
      const { queryByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({ isReadOnly: true })}
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
        </OakThemeProvider>,
      );

      expect(
        queryByRole("link", { name: /Lesson overview/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Bottom nav", () => {
    it("shows 'View all lessons' when not a classroom or coursework assignment", () => {
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsReview
              lessonTitle="Lesson title"
              exitQuizQuestionsArray={[]}
              starterQuizQuestionsArray={[]}
              programmeSlug="programme-slug"
              unitSlug="unit-slug"
              backUrl="/lessons"
              browseData={mockBroweData}
              pageType="browse"
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(
        getByRole("link", { name: /View all lessons/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Share results feedback", () => {
    it("shows 'Link copied to clipboard!' after clicking copy link", async () => {
      const logAttemptSpy = jest.fn(() => "some-attempt-id");
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });

      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
            })}
          >
            <OakPupilClientProvider>
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

      await userEvent.click(getByText("Copy link"));

      expect(
        getByText(
          "Link copied to clipboard! You can share this with your teacher.",
        ),
      ).toBeInTheDocument();
    });

    it("shows 'Failed to share results' when the share promise rejects", async () => {
      const logAttemptSpy = jest.fn(() => ({
        promise: Promise.reject(new Error("Upload failed")),
        attemptId: "some-attempt-id",
      }));
      (useOakPupil as jest.Mock).mockReturnValue({ logAttempt: logAttemptSpy });
      console.error = jest.fn();

      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
            })}
          >
            <OakPupilClientProvider>
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

      await userEvent.click(getByText("Copy link"));

      await waitFor(() =>
        expect(
          getByText("Failed to share results. Please try again."),
        ).toBeInTheDocument(),
      );
    });
  });
});
