import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsLessonOverview } from "./PupilLessonOverview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/pupilTestHelpers/createLessonEngineContext";

describe(PupilViewsLessonOverview, () => {
  it("displays the lesson title", () => {
    const { queryByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            subjectTitle="English"
            subjectSlug="english"
            phase="secondary"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            expirationDate={null}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
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
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext({ updateCurrentSection })}
          >
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              subjectTitle="English"
              subjectSlug="english"
              phase="primary"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
              expirationDate={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      getByRole("link", { name }).click();

      expect(updateCurrentSection).toHaveBeenCalledWith(section);
    });
  });

  it("displays in-progress for in progress sections", () => {
    const { getByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider
          value={createLessonEngineContext({
            currentSection: "starter-quiz",
            sectionResults: {
              "starter-quiz": {
                grade: 1,
                isComplete: false,
                numQuestions: 0,
              },
            },
          })}
        >
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            subjectTitle="English"
            subjectSlug="english"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            expirationDate={null}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(getByTestId("starter-quiz")).toHaveTextContent(/In progress/);
  });

  it("displays the number of questions for each quiz", () => {
    const { getByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            subjectTitle="English"
            subjectSlug="english"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
            expirationDate={null}
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
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
        sectionResults: {
          "starter-quiz": { isComplete: true, numQuestions: 5, grade: 1 },
        },
        lessonStarted: true,
      },
      label: "Continue lesson",
    },
    {
      context: {
        sectionResults: {
          "exit-quiz": { isComplete: true, numQuestions: 5, grade: 1 },
        },
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
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext(context)}
          >
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              subjectTitle="English"
              subjectSlug="english"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
              expirationDate={null}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByTestId("proceed-to-next-section")).toHaveTextContent(label);
    },
  );
});
