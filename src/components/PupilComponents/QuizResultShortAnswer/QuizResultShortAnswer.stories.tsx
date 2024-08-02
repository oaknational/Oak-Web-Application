import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultShortAnswer } from "./QuizResultShortAnswer";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

const meta = {
  component: QuizResultShortAnswer,
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
} satisfies Meta<typeof QuizResultShortAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to display the results of a short answer quiz in the review section
 *
 */
export const Correct: Story = {
  render: (args) => {
    return <QuizResultShortAnswer {...args} />;
  },
  args: {
    answers: "This is the correct answer",
    pupilAnswer: "This is the correct answer",
  },
};

export const IncorrectSingle: Story = {
  render: (args) => {
    return <QuizResultShortAnswer {...args} />;
  },
  args: {
    answers: "This is the correct answer",
    pupilAnswer: "This is the incorrect answer",
  },
};
