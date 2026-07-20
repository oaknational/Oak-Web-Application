import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import {
  completeUnitLessons,
  incompleteUnitLessons,
} from "@/fixtures/teachers/myLibrary";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

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
  trackUnitAccessed: () => console.log("Track unit accessed"),
  trackLessonAccessed: () => console.log("Track lesson accessed"),
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
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibraryUnitCard lessons={completeUnitLessons} {...unit} />
    </OakThemeProvider>
  ),
};

export const IncompleteUnit: Story = {
  render: () => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibraryUnitCard lessons={incompleteUnitLessons} {...unit} />
    </OakThemeProvider>
  ),
};
