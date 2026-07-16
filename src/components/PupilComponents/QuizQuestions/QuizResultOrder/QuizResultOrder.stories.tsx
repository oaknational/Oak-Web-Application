import type { Meta, StoryObj } from "@storybook/nextjs";

import { QuizResultOrder } from "./QuizResultOrder";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

const meta = {
  title: "Components/PupilComponents/QuizQuestions/QuizResultOrder",
  component: QuizResultOrder,
  decorators: [
    (Story) => (
      <MathJaxProvider>
        <Story />
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
    pupilAnswers: [0, 1, 2, 3],
  },
};

export const IncorrectOrder: Story = {
  render: (args) => {
    return <QuizResultOrder {...args} />;
  },
  args: {
    answers: orderAnswers,
    feedback: ["correct", "incorrect", "correct", "incorrect"],
    pupilAnswers: [0, 3, 2, 1],
  },
};
