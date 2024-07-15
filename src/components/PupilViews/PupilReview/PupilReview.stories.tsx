import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilViewsReview } from "./PupilReview.view";

import { LessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

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
      <LessonEngineContext.Provider
        value={{
          currentSection: "review",
          sectionResults: {
            "exit-quiz": {
              grade: args.exitGrade,
              numQuestions: 5,
              isComplete: args.isComplete,
            },
            "starter-quiz": {
              grade: args.starterGrade,
              numQuestions: 5,
              isComplete: args.isComplete,
            },
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
          lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
          lessonStarted: true,
        }}
      >
        <PupilViewsReview lessonTitle={args.lessonTitle} />
      </LessonEngineContext.Provider>
    );
  },
  args: {
    lessonTitle: "The lesson title",
    starterGrade: 4,
    exitGrade: 5,
    isComplete: true,
  },
};
