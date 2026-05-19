import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakP,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import { PupilLessonReviewSections } from "./PupilLessonReviewSections";

const meta = {
  component: PupilLessonReviewSections,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonReviewSections>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
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
        completed: false,
        grade: 0,
        numQuestions: 5,
        resultsSlot: <OakP>Exit quiz results slot</OakP>,
      },
    ],
  },
};
