import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultShortAnswer } from "./QuizResultShortAnswer";

const meta = {
  component: QuizResultShortAnswer,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
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
    feedback: "correct",
    pupilAnswer: "This is the correct answer",
  },
};

export const Incorrect: Story = {
  render: (args) => {
    return <QuizResultShortAnswer {...args} />;
  },
  args: {
    feedback: "incorrect",
    pupilAnswer: "This is the incorrect answer",
  },
};
