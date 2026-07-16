import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonQuizNextButton } from "./PupilLessonQuizNextButton";

const meta = {
  title:
    "Components/PupilComponents/Views/PupilLessonQuiz/PupilLessonQuizNextButton",
  component: PupilLessonQuizNextButton,
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
