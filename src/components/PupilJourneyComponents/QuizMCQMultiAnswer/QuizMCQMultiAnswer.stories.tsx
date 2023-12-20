import type { Meta, StoryObj } from "@storybook/react";

import { QuizMCQMultiAnswer } from "./QuizMCQMultiAnswer";

const meta = {
  component: QuizMCQMultiAnswer,
} satisfies Meta<typeof QuizMCQMultiAnswer>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * This component is not yet implemented.
 */
export const Primary: Story = {
  render: () => <QuizMCQMultiAnswer />,
};
