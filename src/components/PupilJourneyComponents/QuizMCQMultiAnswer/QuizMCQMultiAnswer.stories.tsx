import type { Meta, StoryObj } from "@storybook/react";
import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oak-academy/oak-components";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import { QuizEngineProvider } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const meta = {
  component: QuizMCQMultiAnswer,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineProvider questionsArray={quizQuestions ?? []}>
          <Story />
        </QuizEngineProvider>
      </OakThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      include: ["isFeedbackMode"],
    },
  },
} satisfies Meta<typeof QuizMCQMultiAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to render MCQ questions where there are multiple answers
 * The component updates the state of the quizEngineProvider with the attempted answer
 *
 */
export const Primary: Story = {
  render: (args) => (
    <OakBox $background={"bg-decorative1-very-subdued"} $pa={"inner-padding-m"}>
      <QuizMCQMultiAnswer {...args} />
    </OakBox>
  ),
  args: {
    questionUid: "123",
    answers: quizQuestions?.[0]?.answers?.["multiple-choice"] || [],
  },
};
