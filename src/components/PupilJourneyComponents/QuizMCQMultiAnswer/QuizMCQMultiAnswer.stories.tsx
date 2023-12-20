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

const multiTextAnswers = [...mcqTextAnswers];
if (multiTextAnswers[0]) {
  multiTextAnswers[0].answer_is_correct = true;
}

/*
 * This component is not yet implemented.
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
  args: { questionUid: "123", answers: multiTextAnswers },
};
