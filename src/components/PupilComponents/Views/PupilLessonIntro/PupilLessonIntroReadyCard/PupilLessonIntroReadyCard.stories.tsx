import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonIntroReadyCard } from "./PupilLessonIntroReadyCard";

const meta = {
  component: PupilLessonIntroReadyCard,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonIntroReadyCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    heading: "Before you start",
    lineOne: "Find somewhere comfortable to work.",
    lineTwo: "Make sure your device is charged.",
  },
};
