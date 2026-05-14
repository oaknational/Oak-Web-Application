import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewOutcomes } from "./PupilLessonOverviewOutcomes";

const meta = {
  component: PupilLessonOverviewOutcomes,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonOverviewOutcomes>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: "Lesson outcome",
    outcomes: [
      "I can identify key ideas in the text.",
      "I can explain my reasoning with evidence.",
    ],
  },
};

export const Empty: Story = {
  args: {
    outcomes: [],
  },
};
