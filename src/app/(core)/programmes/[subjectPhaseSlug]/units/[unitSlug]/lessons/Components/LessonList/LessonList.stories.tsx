import { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { ClerkProvider } from "@clerk/nextjs";
import { ComponentProps, ReactNode } from "react";

import LessonList from "./LessonList";

import { oakNotificationsContext } from "@/context/OakNotifications/OakNotificationsProvider";
import { saveCountContext } from "@/context/SaveCount/SaveCountProvider";

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

const defaultArgs: LessonListProps = {
  programmeSlug: "science-secondary-ks4",
  unitSlug: "coordination-and-control",
  unitTitle: "Coordination and control: the human nervous system",
  unitDescription:
    "This unit explores the structure and function of the nervous system, including the CNS, reflex arcs, and the eye. It covers brain structure, common eye defects, and the challenges in treating nervous system damage. It also addresses ethical considerations.",
  subjectTitle: "Biology",
  subjectSlug: "science",
  keyStageSlug: "ks4",
  keyStageTitle: "Key Stage 4",
  unitIndexLabel: "Unit 14 of 28",
  lessonCount: 4,
  lessons: [
    {
      lessonSlug: "human-nervous-system",
      lessonTitle: "The human nervous system",
      pupilLessonOutcome:
        "I can describe the parts that make up the human nervous system that enables us to sense and respond to changes.",
      orderInUnit: 1,
      isUnpublished: false,
    },
    {
      lessonSlug: "neurones-and-synapses",
      lessonTitle: "Neurones and synapses",
      pupilLessonOutcome:
        "I can describe the structures and functions of neurones and the synapses between neurones.",
      orderInUnit: 2,
      isUnpublished: false,
    },
    {
      lessonSlug: "human-reaction-time-practical",
      lessonTitle: "Human reaction time: practical",
      pupilLessonOutcome:
        "I can predict, plan and carry out an investigation into the effect of a factor on human reaction time, and analyse the data to draw a conclusion.",
      orderInUnit: 3,
      isUnpublished: false,
    },
    {
      lessonSlug: "structure-and-function-reflex-arc",
      lessonTitle: "The structure and function of a reflex arc",
      pupilLessonOutcome:
        "I can describe what a reflex response is and the path a nerve impulse takes through a reflex arc in the nervous system.",
      orderInUnit: 4,
      isUnpublished: false,
    },
  ],
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
