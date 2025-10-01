import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultMatch } from "./QuizResultMatch";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { matchAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  component: QuizResultMatch,
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
} satisfies Meta<typeof QuizResultMatch>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to display
 *
 */
export const CorrectMatch: Story = {
  render: (args) => {
    return <QuizResultMatch {...args} />;
  },
  args: {
    answers: matchAnswers,
    feedback: ["correct", "correct", "correct"],
    pupilAnswers: [0, 1, 2],
  },
};

export const IncorrectOrder: Story = {
  render: (args) => {
    return <QuizResultMatch {...args} />;
  },
  args: {
    answers: matchAnswers,
    feedback: ["correct", "incorrect", "incorrect"],
    pupilAnswers: [0, 2, 1],
  },
};
