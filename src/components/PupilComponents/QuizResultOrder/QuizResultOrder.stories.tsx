import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultOrder } from "./QuizResultOrder";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizResultOrder,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <Story />
        </OakThemeProvider>
      </MathJaxProvider>
    ),
  ],
  parameters: {
    controls: {
      include: [],
    },
  },
} satisfies Meta<typeof QuizResultOrder>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to display
 *
 */
export const CorrectOrder: Story = {
  render: (args) => {
    return <QuizResultOrder {...args} />;
  },
  args: {
    answers: orderAnswers,
    feedback: ["correct", "correct", "correct", "correct"],
  },
};

export const IncorrectOrder: Story = {
  render: (args) => {
    return <QuizResultOrder {...args} />;
  },
  args: {
    answers: orderAnswers,
    feedback: ["correct", "incorrect", "correct", "incorrect"],
  },
};
