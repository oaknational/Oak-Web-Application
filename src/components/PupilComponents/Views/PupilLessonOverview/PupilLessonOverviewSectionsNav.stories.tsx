import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewSectionsNav } from "./PupilLessonOverviewSectionsNav";
import { LessonOverviewSectionName } from "./lessonOverviewSections";

const meta = {
  component: PupilLessonOverviewSectionsNav,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonOverviewSectionsNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        section: LessonOverviewSectionName.Intro,
        href: "#intro",
        progress: "complete",
        isLoading: false,
        onClick: () => {},
      },
      {
        section: LessonOverviewSectionName.StarterQuiz,
        href: "#starter-quiz",
        progress: "in-progress",
        numQuestions: 4,
        grade: 3,
        isLoading: false,
        onClick: () => {},
      },
      {
        section: LessonOverviewSectionName.Video,
        href: "#video",
        progress: "not-started",
        isLoading: false,
        onClick: () => {},
      },
      {
        section: LessonOverviewSectionName.ExitQuiz,
        href: "#exit-quiz",
        progress: "not-started",
        numQuestions: 5,
        isLoading: false,
        onClick: () => {},
      },
    ],
  },
};

export const LoadingAndDisabled: Story = {
  args: {
    items: [
      {
        section: LessonOverviewSectionName.Intro,
        href: "#intro",
        progress: "not-started",
        isLoading: true,
        onClick: () => {},
      },
      {
        section: LessonOverviewSectionName.StarterQuiz,
        href: "#starter-quiz",
        progress: "not-started",
        isLoading: false,
        disabled: true,
        numQuestions: 4,
        onClick: () => {},
      },
    ],
  },
};
