import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsReview } from "./PupilReview.view";

import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";
import {
  exitQuizQuestions,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

type CustomArgs = React.ComponentProps<typeof PupilViewsReview> & {
  starterGrade: number;
  exitGrade: number;
  isComplete: boolean;
};

const meta: Meta<CustomArgs> = {
  component: PupilViewsReview,
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
} satisfies Meta<typeof PupilViewsReview>;

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
            timeStamp: { section: "review", time: 0 },
            currentSection: "review",
            sectionResults: {
              "exit-quiz": {
                grade: args.exitGrade,
                numQuestions: 5,
                isComplete: args.isComplete,
                questionResults:
                  sectionResultsFixture["exit-quiz"]?.questionResults,
              },
              "starter-quiz": {
                grade: args.starterGrade,
                numQuestions: 5,
                isComplete: args.isComplete,
                questionResults:
                  sectionResultsFixture["starter-quiz"]?.questionResults,
              },
              video: {
                played: false,
                duration: 0,
                timeElapsed: 0,
                isComplete: args.isComplete,
                muted: false,
                signedOpened: false,
                transcriptOpened: false,
              },
              intro: {
                worksheetAvailable: false,
                worksheetDownloaded: false,
                isComplete: args.isComplete,
              },
            },
            isLessonComplete: args.isComplete,
            completeActivity: () => {},
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
            updateWorksheetDownloaded: () => {},
            updateAdditionalFilesDownloaded: () => {},
          }}
        >
          <PupilViewsReview
            lessonTitle={args.lessonTitle}
            starterQuizQuestionsArray={quizQuestions}
            exitQuizQuestionsArray={exitQuizQuestions}
            programmeSlug="programme-slug"
            unitSlug="unit-slug"
            pageType="browse"
            browseData={lessonBrowseDataFixture({})}
          />
        </LessonEngineContext.Provider>
      </MathJaxProvider>
    );
  },
  args: {
    lessonTitle: "The lesson title",
    starterGrade: 4,
    exitGrade: 5,
    isComplete: true,
  },
};
