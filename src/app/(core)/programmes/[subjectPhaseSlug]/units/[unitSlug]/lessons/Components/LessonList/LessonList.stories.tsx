import { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { ClerkProvider } from "@clerk/nextjs";
import { ComponentProps, ReactNode } from "react";

import LessonList from "./LessonList";

import { oakNotificationsContext } from "@/context/OakNotifications/OakNotificationsProvider";
import { saveCountContext } from "@/context/SaveCount/SaveCountProvider";
import lessonListingFixture, {
  lessonsWithUnpublishedContent,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";

const MockSaveCountProvider = ({ children }: { children: ReactNode }) => {
  const SaveCountProvider = saveCountContext.Provider;

  const value = {
    savedUnitsCount: 0,
    incrementSavedUnitsCount: () => console.log("save +1"),
    decrementSavedUnitsCount: () => console.log("save -1"),
    setSavedUnitsCount: () => console.log("save units count"),
  };

  return <SaveCountProvider value={value}>{children}</SaveCountProvider>;
};

const MockNotificationsProvider = ({ children }: { children: ReactNode }) => {
  const NotificationsProvider = oakNotificationsContext.Provider;

  const value = {
    currentToastProps: null,
    setCurrentToastProps: () => console.log("set toast props"),
    currentBannerProps: null,
    setCurrentBannerProps: () => console.log("set banner props"),
  };

  return (
    <NotificationsProvider value={value}>{children}</NotificationsProvider>
  );
};

const meta: Meta<typeof LessonList> = {
  component: LessonList,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ClerkProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <MockSaveCountProvider>
            <MockNotificationsProvider>
              <Story />
            </MockNotificationsProvider>
          </MockSaveCountProvider>
        </OakThemeProvider>
      </ClerkProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LessonList>;
type LessonListProps = ComponentProps<typeof LessonList>;

const lessonOne = {
  ...lessonsWithUnpublishedContent[0],
  lessonSlug: "human-nervous-system",
  lessonTitle: "The human nervous system",
  description:
    "In this lesson we explore how the human nervous system helps us sense and respond to changes.",
  pupilLessonOutcome:
    "I can describe the parts that make up the human nervous system that enables us to sense and respond to changes.",
  orderInUnit: 1,
  isUnpublished: false,
  loginRequired: false,
  geoRestricted: false,
  lessonReleaseDate: null,
  expired: false,
};

const lessonTwo = {
  ...lessonsWithUnpublishedContent[2],
  lessonSlug: "neurones-and-synapses",
  lessonTitle: "Neurones and synapses",
  description:
    "In this lesson we describe neurones and how signals travel across synapses.",
  pupilLessonOutcome:
    "I can describe the structures and functions of neurones and the synapses between neurones.",
  orderInUnit: 2,
  isUnpublished: false,
  loginRequired: false,
  geoRestricted: false,
  lessonReleaseDate: null,
  expired: false,
};

const lessonThree = {
  ...lessonsWithUnpublishedContent[3],
  lessonSlug: "human-reaction-time-practical",
  lessonTitle: "Human reaction time: practical",
  description:
    "In this lesson we plan and carry out an investigation into reaction time.",
  pupilLessonOutcome:
    "I can predict, plan and carry out an investigation into the effect of a factor on human reaction time, and analyse the data to draw a conclusion.",
  orderInUnit: 3,
  isUnpublished: false,
  loginRequired: false,
  geoRestricted: false,
  lessonReleaseDate: null,
  expired: false,
};

const lessonFour = {
  ...lessonsWithUnpublishedContent[4],
  lessonSlug: "structure-and-function-reflex-arc",
  lessonTitle: "The structure and function of a reflex arc",
  description:
    "In this lesson we describe reflex responses and the pathway through a reflex arc.",
  pupilLessonOutcome:
    "I can describe what a reflex response is and the path a nerve impulse takes through a reflex arc in the nervous system.",
  orderInUnit: 4,
  isUnpublished: false,
  loginRequired: false,
  geoRestricted: false,
  lessonReleaseDate: null,
  expired: false,
};

const fixtureData = lessonListingFixture({
  programmeSlug: "science-secondary-ks4",
  unitSlug: "coordination-and-control",
  unitTitle: "Coordination and control: the human nervous system",
  subjectTitle: "Biology",
  subjectSlug: "science",
  keyStageSlug: "ks4",
  keyStageTitle: "Key Stage 4",
  lessons: [lessonOne, lessonTwo, lessonThree, lessonFour],
});

const defaultArgs: LessonListProps = {
  programmeSlug: fixtureData.programmeSlug,
  unitSlug: fixtureData.unitSlug,
  unitTitle: fixtureData.unitTitle,
  unitDescription:
    "This unit explores the structure and function of the nervous system, including the CNS, reflex arcs, and the eye. It covers brain structure, common eye defects, and the challenges in treating nervous system damage. It also addresses ethical considerations.",
  subjectTitle: fixtureData.subjectTitle,
  subjectSlug: fixtureData.subjectSlug,
  keyStageSlug: fixtureData.keyStageSlug,
  keyStageTitle: fixtureData.keyStageTitle,
  unitOrder: 14,
  unitCount: 28,
  lessonCount: 4,
  lessons: fixtureData.lessons,
};

export const Default: Story = {
  args: defaultArgs,
};

export const LongContent: Story = {
  args: {
    ...defaultArgs,
    unitTitle:
      "Coordination and control: the human nervous system and how the central nervous system coordinates complex processes",
    lessons: defaultArgs.lessons.map((lesson, index) =>
      index === 0
        ? {
            ...lesson,
            lessonTitle:
              "The human nervous system and response mechanisms in complex living organisms",
          }
        : lesson,
    ),
  },
};

export const CopyrightedLesson: Story = {
  args: {
    ...defaultArgs,
    lessons: [
      lessonOne,
      {
        ...lessonTwo,
        geoRestricted: true,
        loginRequired: false,
        isUnpublished: false,
      },
    ],
    lessonCount: 2,
  },
};

export const ComingSoonLesson: Story = {
  args: {
    ...defaultArgs,
    lessons: [
      lessonOne,
      {
        ...lessonsWithUnpublishedContent[1],
        lessonSlug: "future-lesson",
        lessonTitle: "Future lesson",
        orderInUnit: 2,
        isUnpublished: true,
        lessonReleaseDate: null,
        expired: false,
      },
    ],
    lessonCount: 2,
  },
};
