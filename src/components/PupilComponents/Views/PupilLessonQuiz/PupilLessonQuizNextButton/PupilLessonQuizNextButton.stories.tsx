import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonQuizNextButton } from "./PupilLessonQuizNextButton";

const meta = {
  component: PupilLessonQuizNextButton,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonQuizNextButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Next question",
    onClick: () => {},
  },
};

export const LastQuestion: Story = {
  args: {
    label: "Lesson review",
    onClick: () => {},
  },
};
