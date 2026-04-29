import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewView } from "./PupilLessonOverview.view";
import { PupilLessonOverviewContentGuidance } from "./PupilLessonOverviewContentGuidance";
import { PupilLessonOverviewOutcomes } from "./PupilLessonOverviewOutcomes";
import { LessonOverviewSectionName } from "./lessonOverviewSections";

import { TakedownBanner } from "@/components/SharedComponents/TakedownBanner/TakedownBanner";
import { ViewAllLessonsButton } from "@/components/PupilComponents/ViewAllLessonsButton/ViewAllLessonsButton";

const meta = {
  component: PupilLessonOverviewView,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
} satisfies Meta<typeof PupilLessonOverviewView>;

export default meta;

type Story = StoryObj<typeof meta>;

const sectionsNavItems = [
  {
    section: LessonOverviewSectionName.Intro,
    href: "#intro",
    progress: "complete" as const,
    isLoading: false,
    onClick: () => {},
  },
  {
    section: LessonOverviewSectionName.StarterQuiz,
    href: "#starter-quiz",
    progress: "in-progress" as const,
    numQuestions: 4,
    grade: 3,
    isLoading: false,
    onClick: () => {},
  },
  {
    section: LessonOverviewSectionName.Video,
    href: "#video",
    progress: "not-started" as const,
    isLoading: false,
    onClick: () => {},
  },
  {
    section: LessonOverviewSectionName.ExitQuiz,
    href: "#exit-quiz",
    progress: "not-started" as const,
    numQuestions: 5,
    isLoading: false,
    onClick: () => {},
  },
];

export const Default: Story = {
  args: {
    phase: "primary",
    topNavSlot: null,
    backButtonSlot: (
      <ViewAllLessonsButton
        href={"/pupils/programmes/english-primary-year-1"}
      />
    ),
    bannerSlot: (
      <TakedownBanner
        isExpiring
        isLegacy={true}
        hasNewUnits={true}
        subjectSlug="english"
        userType="pupil"
        onwardHref="/pupils/programmes/english-primary-year-1/options"
        isSingle
      />
    ),
    header: {
      lessonTitle: "Introduction to The Canterbury Tales",
      yearDescription: "Year 1",
      subject: "English",
      subjectSlug: "english",
      phase: "primary",
    },
    outcomesSlot: (
      <PupilLessonOverviewOutcomes
        outcomes={[
          "I can identify the purpose of the prologue.",
          "I can explain why Chaucer used different voices.",
        ]}
      />
    ),
    contentGuidanceSlot: (
      <PupilLessonOverviewContentGuidance
        supervisionLevel="Adult supervision recommended."
        contentGuidance={[
          {
            contentguidanceLabel: "Depiction",
            contentguidanceArea: "Violence",
            contentguidanceDescription: "Contains references to conflict.",
          },
        ]}
      />
    ),
    sectionsNav: {
      items: sectionsNavItems,
    },
    bottomNav: {
      proceedLabel: "Continue lesson",
      onProceed: () => {},
      disabled: false,
    },
  },
};

export const Minimal: Story = {
  args: {
    phase: "secondary",
    header: {
      lessonTitle: "Algebraic simplification",
      yearDescription: "Year 7",
      subject: "Maths",
      subjectSlug: "maths",
      phase: "secondary",
    },
    sectionsNav: {
      items: sectionsNavItems,
    },
    bottomNav: {
      proceedLabel: "Start lesson",
      onProceed: () => {},
      disabled: false,
    },
  },
};
