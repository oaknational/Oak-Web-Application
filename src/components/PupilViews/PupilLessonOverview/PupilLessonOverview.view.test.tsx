import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsLessonOverview } from "./PupilLessonOverview.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import {
  LessonEngineContext,
  LessonEngineContextType,
} from "@/components/PupilComponents/LessonEngineProvider";
import { createLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider/LessonEngineProvider.test";

describe(PupilViewsLessonOverview, () => {
  it("displays the lesson title", () => {
    const { queryByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonEngineContext.Provider value={createLessonEngineContext()}>
          <PupilViewsLessonOverview
            lessonTitle="Introduction to The Canterbury Tales"
            subjectTitle="English"
            subjectSlug="english"
            starterQuizNumQuestions={4}
            exitQuizNumQuestions={5}
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
    [/Watch video/, "video"],
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
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      getByRole("button", { name }).click();

      expect(updateCurrentSection).toHaveBeenCalledWith(section);
    });
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
          />
        </LessonEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(getByTestId("starter-quiz")).toHaveTextContent("4 Questions");
    expect(getByTestId("exit-quiz")).toHaveTextContent("Practice 5 questions");
  });

  (
    [
      {
        context: {},
        label: "Let's get ready",
      },
      {
        context: {
          sectionResults: { intro: { isComplete: true } },
        },
        label: "Start lesson",
      },
      {
        context: {
          sectionResults: { "starter-quiz": { isComplete: true } },
        },
        label: "Continue lesson",
      },
      {
        context: {
          sectionResults: { "exit-quiz": { isComplete: true } },
        },
        label: "Continue lesson",
      },
      {
        context: {
          isLessonComplete: true,
        },
        label: "Lesson review",
      },
    ] satisfies { context: Partial<LessonEngineContextType>; label: string }[]
  ).forEach((example) => {
    it(`displays '${example.label}' for the proceed to next section button`, () => {
      const { getByTestId } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <LessonEngineContext.Provider
            value={createLessonEngineContext(example.context)}
          >
            <PupilViewsLessonOverview
              lessonTitle="Introduction to The Canterbury Tales"
              subjectTitle="English"
              subjectSlug="english"
              starterQuizNumQuestions={4}
              exitQuizNumQuestions={5}
            />
          </LessonEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(getByTestId("proceed-to-next-section")).toHaveTextContent(
        example.label,
      );
    });
  });
});
