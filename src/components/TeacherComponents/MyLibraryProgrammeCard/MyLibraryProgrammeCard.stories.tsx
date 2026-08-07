import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";

import MyLibraryProgrammeCard from "./MyLibraryProgrammeCard";

import {
  completeUnitLessons,
  incompleteUnitLessons,
} from "@/fixtures/teachers/myLibrary";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

const sampleUnits = [
  {
    unitTitle: "Fiction: Science Fiction Writing",
    unitSlug: "fiction-science-fiction-writing",
    programmeSlug: "english-secondary-ks4-aqa",
    year: "Year 10",
    savedAt: "2025-05-01T09:00:00.199406+00:00",
    href: "/teachers/programmes/english-secondary-ks4-aqa/units/fiction-science-fiction-writing/lessons",
    lessons: completeUnitLessons,
    keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
    keyStageSlug: "key-stage-4",
    subjectTitle: "English",
    subjectSlug: "english",
    trackUnitAccessed: () => console.log("Track unit accessed 1"),
    trackLessonAccessed: () => console.log("Track lesson accessed 1"),
  },
  {
    unitTitle: "Writing for Different Audiences",
    unitSlug: "writing-for-different-audiences",
    programmeSlug: "english-secondary-ks4-aqa",
    year: "Year 9",
    savedAt: "2025-04-15T14:30:00.199406+00:00",
    href: "/teachers/programmes/english-secondary-ks4-aqa/units/writing-for-different-audiences/lessons",
    lessons: incompleteUnitLessons,
    keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
    keyStageSlug: "key-stage-4",
    subjectTitle: "English",
    subjectSlug: "english",
    trackUnitAccessed: () => console.log("Track unit accessed 2"),
    trackLessonAccessed: () => console.log("Track lesson accessed"),
  },
  {
    unitTitle: "Poetry Analysis: Romanticism",
    unitSlug: "poetry-analysis-romanticism",
    programmeSlug: "english-secondary-ks4-aqa",
    year: "Year 11",
    savedAt: new Date().toISOString(),
    href: "/teachers/programmes/english-secondary-ks4-aqa/units/poetry-analysis-romanticism/lessons",
    lessons: completeUnitLessons.slice(0, 3),
    keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
    keyStageSlug: "key-stage-4",
    subjectTitle: "English",
    subjectSlug: "english",
    trackUnitAccessed: () => console.log("Track unit accessed 3"),
    trackLessonAccessed: () => console.log("Track lesson accessed"),
  },
];

const meta: Meta<typeof MyLibraryProgrammeCard> = {
  component: MyLibraryProgrammeCard,
  tags: ["autodocs"],
  args: {
    programmeTitle: "English Secondary KS4 (AQA)",
    programmeHref:
      "/teachers/programmes/english-secondary-ks4-aqa/units/english-secondary-ks4-aqa/units",
    iconName: "subject-english",
    savedUnits: sampleUnits,
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof MyLibraryProgrammeCard>;

export const Default: Story = {
  render: (args) => <MyLibraryProgrammeCard {...args} />,
};
