import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonReviewFeedbackCard } from "./PupilLessonReviewFeedbackCard";

const meta = {
  component: PupilLessonReviewFeedbackCard,
} satisfies Meta<typeof PupilLessonReviewFeedbackCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feedback: "Great work, keep it up!",
  },
};
