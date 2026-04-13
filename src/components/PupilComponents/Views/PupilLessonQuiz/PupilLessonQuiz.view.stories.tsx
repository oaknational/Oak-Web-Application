import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBackLink,
  OakCodeRenderer,
  OakFlex,
  OakHeading,
  OakP,
  OakSpan,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonQuizView } from "./PupilLessonQuiz.view";
import { PupilLessonQuizCheckButton } from "./PupilLessonQuizCheckButton";
import { PupilLessonQuizNextButton } from "./PupilLessonQuizNextButton";

const meta = {
  component: PupilLessonQuizView,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonQuizView>;

export default meta;

type Story = StoryObj<typeof meta>;

const questionContent = (
  <OakFlex
    $flexDirection="column"
    $gap="spacing-16"
    $maxWidth={["100%", "spacing-640", "spacing-640"]}
    $mh="auto"
    $ph={["spacing-16", "spacing-24", "spacing-0"]}
  >
    <OakHeading tag="h1" $font={["heading-6", "heading-5", "heading-4"]}>
      What is 7 x 8?
    </OakHeading>
    <OakP>Select one answer.</OakP>
  </OakFlex>
);

export const CheckMode: Story = {
  args: {
    lessonSectionName: "starter-quiz",
    topNav: {
      section: "starter-quiz",
      backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
      currentQuestion: 1,
      totalQuestions: 4,
    },
    bottomNav: {
      hint: <OakCodeRenderer string="Try using your times table facts." />,
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
    questionSlot: questionContent,
  },
};

export const FeedbackMode: Story = {
  args: {
    lessonSectionName: "exit-quiz",
    celebrate: true,
    topNav: {
      section: "exit-quiz",
      backLinkSlot: <OakBackLink href="#" label="Back to overview" />,
      currentQuestion: 4,
      totalQuestions: 4,
    },
    bottomNav: {
      feedback: "correct",
      answerFeedback: (
        <OakSpan $color="text-primary" $font="body-2">
          Well done!
        </OakSpan>
      ),
      actionSlot: (
        <PupilLessonQuizNextButton label="Lesson review" onClick={() => {}} />
      ),
    },
    questionSlot: questionContent,
  },
};
