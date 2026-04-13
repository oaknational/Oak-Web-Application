import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakImage,
  OakP,
  OakTertiaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonReviewView } from "./PupilLessonReview.view";
import { PupilLessonReviewBottomNav } from "./PupilLessonReviewBottomNav";
import { PupilLessonReviewFeedbackCard } from "./PupilLessonReviewFeedbackCard";
import { PupilLessonReviewSections } from "./PupilLessonReviewSections";
import { PupilLessonReviewShareOptions } from "./PupilLessonReviewShareOptions";

const meta = {
  component: PupilLessonReviewView,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonReviewView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    phase: "primary",
    bottomNavSlot: <PupilLessonReviewBottomNav href="#" />,
    overviewButtonSlot: (
      <OakTertiaryButton iconName="arrow-left" element="a" href="#">
        Lesson overview
      </OakTertiaryButton>
    ),
    shareOptionsSlot: (
      <PupilLessonReviewShareOptions
        showPrintable
        printableHref="#"
        onCopyLink={() => {}}
        shareState="initial"
      />
    ),
    lessonTitle: "Introduction to The Canterbury Tales",
    illustrationSlot: (
      <OakImage
        $display={["none", "none", "block"]}
        $height="spacing-240"
        alt="Lesson review illustration"
        src={`https://${process.env.NEXT_PUBLIC_OAK_ASSETS_HOST}/${process.env.NEXT_PUBLIC_OAK_ASSETS_PATH}/v1699887218/svg-illustrations/xrazqgtjmbdf1clz8wic`}
      />
    ),
    sectionSummarySlot: (
      <PupilLessonReviewSections
        items={[
          { section: "intro", completed: true },
          {
            section: "starter-quiz",
            completed: true,
            grade: 3,
            numQuestions: 4,
            resultsSlot: <OakP>Starter quiz results slot</OakP>,
          },
          { section: "video", completed: true },
          {
            section: "exit-quiz",
            completed: true,
            grade: 4,
            numQuestions: 5,
            resultsSlot: <OakP>Exit quiz results slot</OakP>,
          },
        ]}
      />
    ),
    feedbackSlot: (
      <PupilLessonReviewFeedbackCard feedback="Great work, keep it up!" />
    ),
  },
};

export const ReadOnly: Story = {
  args: {
    phase: "secondary",
    lessonTitle: "Solving linear equations",
    sectionSummarySlot: (
      <PupilLessonReviewSections
        items={[
          { section: "intro", completed: true },
          { section: "video", completed: true },
        ]}
      />
    ),
    feedbackSlot: (
      <PupilLessonReviewFeedbackCard feedback="You have completed this lesson." />
    ),
  },
};
