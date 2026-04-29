import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonQuizCheckButton } from "./PupilLessonQuizCheckButton";

const meta = {
  component: PupilLessonQuizCheckButton,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonQuizCheckButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    formId: "quiz-form",
  },
};

export const WithTooltip: Story = {
  args: {
    formId: "quiz-form",
    tooltip: "You need to select an answer to move on!",
    isTooltipOpen: true,
  },
};
