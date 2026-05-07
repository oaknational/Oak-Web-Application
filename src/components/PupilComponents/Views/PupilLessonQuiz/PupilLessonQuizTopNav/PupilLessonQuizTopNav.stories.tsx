import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBackLink,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonQuizTopNav } from "./PupilLessonQuizTopNav";

const meta = {
  component: PupilLessonQuizTopNav,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonQuizTopNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StarterQuiz: Story = {
  args: {
    section: "starter-quiz",
    backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
    currentQuestion: 2,
    totalQuestions: 5,
  },
};

export const ExplanatoryText: Story = {
  args: {
    section: "exit-quiz",
    backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
    isExplanatoryText: true,
  },
};
