import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakCodeRenderer } from "@oaknational/oak-components";

import { PupilLessonQuizCheckButton } from "../PupilLessonQuizCheckButton/PupilLessonQuizCheckButton";
import { PupilLessonQuizNextButton } from "../PupilLessonQuizNextButton/PupilLessonQuizNextButton";

import { PupilLessonQuizBottomNav } from "./PupilLessonQuizBottomNav";

const meta = {
  title:
    "Components/PupilComponents/Views/PupilLessonQuiz/PupilLessonQuizBottomNav",
  component: PupilLessonQuizBottomNav,
} satisfies Meta<typeof PupilLessonQuizBottomNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CheckMode: Story = {
  args: {
    hint: <OakCodeRenderer string="Think about factors of 56." />,
    feedback: null,
    answerFeedback: null,
    actionSlot: (
      <PupilLessonQuizCheckButton
        formId="quiz-form"
        tooltip="You need to select an answer to move on!"
        isTooltipOpen
      />
    ),
  },
};

export const FeedbackMode: Story = {
  args: {
    feedback: "correct",
    actionSlot: (
      <PupilLessonQuizNextButton label="Continue lesson" onClick={() => {}} />
    ),
  },
};
