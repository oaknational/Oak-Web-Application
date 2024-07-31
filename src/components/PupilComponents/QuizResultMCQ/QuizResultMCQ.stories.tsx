import type { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultMCQ } from "./QuizResultMCQ";

const meta = {
  component: QuizResultMCQ,
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
} satisfies Meta<typeof QuizResultMCQ>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * A component to render MCQ questions where there is a single answer
 *
 */
export const Default: Story = {
  render: (args) => {
    return <QuizResultMCQ {...args} />;
  },
  args: {},
};
