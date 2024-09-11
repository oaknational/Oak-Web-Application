import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useOakPupil } from "@oaknational/oak-pupil-client";
import userEvent from "@testing-library/user-event";

import { PupilViewsLessonOverview } from "./PupilLessonOverview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";
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

describe("PupilViewsLessonOverview", () => {
  it("displays the lesson title", () => {
    const { queryByRole } = renderWithTheme(
      <PupilProvider>
        {" "}
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              subjectTitle="English"
              subjectSlug="english"
              phase="secondary"
              lessonSlug="lesson-slug"
              programmeSlug="programme-slug"
              unitSlug="unit-slug"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
              expirationDate={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
        ,
      </PupilProvider>,
    );

    expect(
      queryByRole("heading", { name: "Introduction to The Canterbury Tales" }),
    ).toBeInTheDocument();
  });

  [
    [/Intro/, "intro"],
    [/Starter quiz/, "starter-quiz"],
    [/Exit quiz/, "exit-quiz"],
    [/Lesson video/, "video"],
  ].forEach(([name, section]) => {
    it(`allows navigation to the "${section}" section of the quiz`, () => {
      const updateCurrentSection = jest.fn();

      const { getByRole } = renderWithTheme(
        <PupilProvider>
          {" "}
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider
              value={createLessonEngineContext({ updateCurrentSection })}
            >
              <PupilViewsLessonOverview
                lessonTitle="Introduction to The Canterbury Tales"
                subjectTitle="English"
                subjectSlug="english"
                phase="primary"
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                starterQuizNumQuestions={4}
                exitQuizNumQuestions={5}
                expirationDate={null}
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
          ,
        </PupilProvider>,
      );

      getByRole("link", { name }).click();

      expect(updateCurrentSection).toHaveBeenCalledWith(section);
    });
  });

  it("displays in-progress for in progress sections", () => {
    const { getByTestId } = renderWithTheme(
      <PupilProvider>
        {" "}
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              currentSection: "starter-quiz",
              sectionResults: {
                "starter-quiz": { grade: 1, isComplete: false },
              },
            })}
          >
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              subjectTitle="English"
              subjectSlug="english"
              lessonSlug="lesson-slug"
              programmeSlug="programme-slug"
              unitSlug="unit-slug"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
              expirationDate={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      </PupilProvider>,
    );

    expect(getByTestId("starter-quiz")).toHaveTextContent(/In progress/);
  });

  it("displays the number of questions for each quiz", () => {
    // console.log(logAttempt);
    const { getByTestId } = renderWithTheme(
      <PupilProvider>
        {" "}
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider value={createLessonEngineContext()}>
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              subjectTitle="English"
              subjectSlug="english"
              lessonSlug="lesson-slug"
              programmeSlug="programme-slug"
              unitSlug="unit-slug"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
              expirationDate={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>
      </PupilProvider>,
    );

    expect(getByTestId("starter-quiz")).toHaveTextContent(/4 Questions/);
    expect(getByTestId("exit-quiz")).toHaveTextContent(/5 questions/);
  });

  it.each([
    {
      context: { lessonStarted: false },
      label: "Let's get ready",
    },
    {
      context: {
        sectionResults: { intro: { isComplete: true } },
        lessonStarted: false,
      },
      label: "Start lesson",
    },
    {
      context: {
        sectionResults: { "starter-quiz": { isComplete: true } },
        lessonStarted: true,
      },
      label: "Continue lesson",
    },
    {
      context: {
        sectionResults: { "exit-quiz": { isComplete: true } },
        lessonStarted: true,
      },
      label: "Continue lesson",
    },
    {
      context: {
        isLessonComplete: true,
        lessonStarted: true,
      },
      label: "Lesson review",
    },
  ] satisfies Array<{
    context: Partial<LessonEngineContextType>;
    label: string;
  }>)(
    'renders "$label" for the proceed to next section button',
    ({ label, context }) => {
      const { getByTestId } = renderWithTheme(
        <PupilProvider>
          {" "}
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider
              value={createLessonEngineContext(context)}
            >
              <PupilViewsLessonOverview
                lessonTitle="Introduction to The Canterbury Tales"
                subjectTitle="English"
                subjectSlug="english"
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                starterQuizNumQuestions={4}
                exitQuizNumQuestions={5}
                expirationDate={null}
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </PupilProvider>,
      );

      expect(getByTestId("proceed-to-next-section")).toHaveTextContent(label);
    },
  );
  describe("should display print Share lesson results button", () => {
    it("should not display the print button when the feature flag is disabled", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(false);
      const { queryByRole } = renderWithTheme(
        <PupilProvider>
          {" "}
          <OakThemeProvider theme={oakDefaultTheme}>
            <LessonEngineContext.Provider value={createLessonEngineContext()}>
              <PupilViewsLessonOverview
                lessonTitle="Introduction to The Canterbury Tales"
                subjectTitle="English"
                subjectSlug="english"
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                starterQuizNumQuestions={4}
                exitQuizNumQuestions={5}
                expirationDate={null}
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
              <PupilViewsLessonOverview
                lessonTitle="Introduction to The Canterbury Tales"
                subjectTitle="English"
                subjectSlug="english"
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                starterQuizNumQuestions={4}
                exitQuizNumQuestions={5}
                expirationDate={null}
              />
            </LessonEngineContext.Provider>
          </OakThemeProvider>
        </PupilProvider>,
      );

      expect(
        getByRole("button", { name: "Share lesson results" }),
      ).toBeInTheDocument();
    });
    it("logAttempt function is called when button is clicked", () => {
      (useFeatureFlagEnabled as jest.Mock).mockReturnValue(true);
      const { getByRole } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({
              sectionResults: sectionResultsFixture,
            })}
          >
            {" "}
            <PupilProvider>
              <PupilViewsLessonOverview
                lessonTitle="Introduction to The Canterbury Tales"
                subjectTitle="English"
                subjectSlug="english"
                lessonSlug="lesson-slug"
                programmeSlug="programme-slug"
                unitSlug="unit-slug"
                starterQuizNumQuestions={4}
                exitQuizNumQuestions={5}
                expirationDate={null}
              />
            </PupilProvider>
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );
      const button = getByRole("button", { name: "Share lesson results" });
      userEvent.click(button).then(() => {
        expect(useOakPupil().logAttempt).toHaveBeenCalledTimes(1);
      });
    });
  });
});
