import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonIntroReadyCard } from "./PupilLessonIntroReadyCard";

const meta = {
  component: PupilLessonIntroReadyCard,
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
