import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsResults } from "./PupilResults.view";

import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import {
  exitQuizQuestions,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";

type CustomArgs = React.ComponentProps<typeof PupilViewsResults> & {
  starterGrade: number;
  exitGrade: number;
  isComplete: boolean;
};

const meta: Meta<CustomArgs> = {
  component: PupilViewsResults,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],

  argTypes: {},
  parameters: {
    controls: {
      starterGrade: {
        control: {
          type: "number",
        },
      },
      exitGrade: {
        control: {
          type: "number",
        },
      },
      include: ["starterGrade", "exitGrade", "isComplete"],
    },
  },
} satisfies Meta<typeof PupilViewsResults>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * This is the view users will see on encountering an expired lesson
 *
 */

export const Default: Story = {
  render: (args) => {
    return (
      <MathJaxProvider>
        {" "}
        <LessonEngineContext.Provider
          value={{
            currentSection: "review",
            sectionResults: {
              "exit-quiz": sectionResultsFixture["exit-quiz"],
              "starter-quiz": sectionResultsFixture["starter-quiz"],
              video: {
                played: false,
                duration: 0,
                timeElapsed: 0,
                isComplete: args.isComplete,
              },
              intro: {
                worksheetAvailable: false,
                worksheetDownloaded: false,
                isComplete: args.isComplete,
              },
            },
            isLessonComplete: args.isComplete,
            completeSection: () => {},
            updateCurrentSection: () => {},
            proceedToNextSection: () => {},
            updateSectionResult: () => {},
            lessonReviewSections: [
              "intro",
              "starter-quiz",
              "video",
              "exit-quiz",
            ],
            lessonStarted: true,
          }}
        >
          <PupilViewsResults {...args} />
        </LessonEngineContext.Provider>
      </MathJaxProvider>
    );
  },
  args: {
    starterQuizQuestionsArray: quizQuestions,
    exitQuizQuestionsArray: exitQuizQuestions,
    attemptData: {
      browseData: {
        subject: "ewfw",
        yearDescription: "efwef",
      },
      lessonData: {
        slug: "efwef",
        title: "efwef",
      },
      sectionResults: sectionResultsFixture,
      //   {
      //     "exit-quiz": sectionResultsFixture["exit-quiz"],
      //     "starter-quiz": sectionResultsFixture["starter-quiz"],
      //     video: {
      //       played: false,
      //       duration: 0,
      //       timeElapsed: 0,
      //       isComplete: true,
      //     },
      //     intro: {
      //       worksheetAvailable: false,
      //       worksheetDownloaded: false,
      //       isComplete: true,
      //     },
      //   },
    },
  },
};
