import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewBottomNav } from "./PupilLessonOverviewBottomNav";

const meta = {
  component: PupilLessonOverviewBottomNav,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonOverviewBottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    proceedLabel: "Continue lesson",
    onProceed: () => {},
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    proceedLabel: "Continue lesson",
    onProceed: () => {},
    disabled: true,
  },
};
