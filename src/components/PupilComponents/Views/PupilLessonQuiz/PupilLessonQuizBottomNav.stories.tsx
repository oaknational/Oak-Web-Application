import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakCodeRenderer,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonQuizBottomNav } from "./PupilLessonQuizBottomNav";
import { PupilLessonQuizCheckButton } from "./PupilLessonQuizCheckButton";
import { PupilLessonQuizNextButton } from "./PupilLessonQuizNextButton";

const meta = {
  component: PupilLessonQuizBottomNav,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
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
