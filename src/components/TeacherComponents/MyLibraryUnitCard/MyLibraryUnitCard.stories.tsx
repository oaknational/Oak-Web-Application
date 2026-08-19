import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import type { TierNameValueType } from "@/browser-lib/avo/Avo";
import {
  completeUnitLessons,
  incompleteUnitLessons,
} from "@/fixtures/teachers/myLibrary";
import {
  KeyStageTitleValueType,
  ExamBoardValueType,
} from "@/browser-lib/avo/Avo";

const unit = {
  unitTitle: "Fiction: Science Fiction Writing",
  unitSlug: "fiction-science-fiction-writing",
  programmeSlug: "english-secondary-ks4-aqa",
  year: "Year 10",
  savedAt: "2025-05-01T09:00:00.199406+00:00",
  href: "/teachers/programmes/english-secondary-ks4-aqa/units/fiction-science-fiction-writing/lessons",
  keyStageTitle: "Key Stage 4" as KeyStageTitleValueType,
  keyStageSlug: "key-stage-4",
  subjectTitle: "English",
  subjectSlug: "english",
  tierName: "Core" as TierNameValueType,
  examBoard: "AQA" as ExamBoardValueType,
  pathway: undefined,
  yearSlug: "year-10",
};

const meta: Meta<typeof MyLibraryUnitCard> = {
  component: MyLibraryUnitCard,
  tags: ["autodocs"],
  args: {
    ...unit,
    lessons: completeUnitLessons,
  },
  argTypes: {
    unitTitle: {
      control: {
        type: "text",
      },
    },
    unitSlug: {
      control: {
        type: "text",
      },
    },
    programmeSlug: {
      control: {
        type: "text",
      },
    },
    year: {
      control: {
        type: "text",
      },
    },
    lessons: {
      control: {
        type: "object",
      },
    },
    savedAt: {
      control: {
        type: "text",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof MyLibraryUnitCard>;

export const CompleteUnit: Story = {
  render: () => <MyLibraryUnitCard lessons={completeUnitLessons} {...unit} />,
};

export const IncompleteUnit: Story = {
  render: () => <MyLibraryUnitCard lessons={incompleteUnitLessons} {...unit} />,
};
