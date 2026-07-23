import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonReviewBottomNav } from "./PupilLessonReviewBottomNav";

const meta = {
  component: PupilLessonReviewBottomNav,
} satisfies Meta<typeof PupilLessonReviewBottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "#",
    label: "View all lessons",
  },
};

export const Hidden: Story = {
  args: {
    href: undefined,
  },
};
