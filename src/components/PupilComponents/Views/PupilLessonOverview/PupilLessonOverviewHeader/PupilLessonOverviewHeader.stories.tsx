import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewHeader } from "./PupilLessonOverviewHeader";

const meta = {
  component: PupilLessonOverviewHeader,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonOverviewHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    lessonTitle: "Introduction to The Canterbury Tales",
    yearDescription: "Year 1",
    subject: "English",
    subjectSlug: "english",
    phase: "primary",
  },
};

export const Secondary: Story = {
  args: {
    lessonTitle: "Solving linear equations",
    yearDescription: "Year 7",
    subject: "Maths",
    subjectSlug: "maths",
    phase: "secondary",
  },
};
