import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { LessonAttemptCamelCase } from "@oaknational/oak-pupil-client";

import { PupilViewsResults } from "./PupilResults.view";

import {
  exitQuizQuestions,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

const meta = {
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
    controls: {},
  },
} satisfies Meta<typeof PupilViewsResults>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <MathJaxProvider>
        <PupilViewsResults {...args} />
      </MathJaxProvider>
    );
  },
  args: {
    browseData: lessonBrowseDataFixture({}),
    starterQuizQuestionsArray: quizQuestions,
    exitQuizQuestionsArray: exitQuizQuestions,
    attemptData: {
      attemptId: "efwef",
      createdAt: "efwef",
      browseData: {
        subject: "ewfw",
        yearDescription: "efwef",
      },
      lessonData: {
        slug: "efwef",
        title: "efwef",
      },
      sectionResults:
        sectionResultsFixture as LessonAttemptCamelCase["sectionResults"],
    },
  },
};
