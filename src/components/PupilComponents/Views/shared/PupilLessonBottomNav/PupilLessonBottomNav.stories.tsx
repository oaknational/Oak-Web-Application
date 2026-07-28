import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonBottomNav } from "./PupilLessonBottomNav";

const meta = {
  component: PupilLessonBottomNav,
} satisfies Meta<typeof PupilLessonBottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    proceedLabel: "Continue lesson",
    onProceed: () => {},
  },
};

export const Disabled: Story = {
  args: {
    proceedLabel: "Continue lesson",
    onProceed: () => {},
    disabled: true,
  },
};
