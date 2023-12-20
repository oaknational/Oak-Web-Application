import type { Meta, StoryObj } from "@storybook/react";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

import {
  OakBox,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oak-academy/oak-components";
import { mcqTextAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const meta = {
  component: QuizMCQMultiAnswer,
  tags: ["autodocs"],
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
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakBox
        $background={"bg-decorative1-very-subdued"}
        $pa={"inner-padding-m"}
      >
        <QuizMCQMultiAnswer {...args} />
      </OakBox>
    </OakThemeProvider>
  ),
  args: {
    questionUid: "123",
    answers: mcqTextAnswers,
    feedback: [true, false, true, false],
    isFeedbackMode: false,
  },
};
