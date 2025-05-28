import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import {
  completeUnitLessons,
  incompleteUnitLessons,
} from "../MyLibraryUnitCard/MyLibraryUnitCard.stories";

import MyLibrarySubjectCard from "./MyLibrarySubjectCard";

const sampleUnits = [
  {
    unitTitle: "Fiction: Science Fiction Writing",
    unitSlug: "fiction-science-fiction-writing",
    programmeSlug: "english-secondary-ks4-aqa",
    year: "Year 10",
    savedAt: "2025-05-01T09:00:00.199406+00:00",
    href: "/teachers/programmes/english-secondary-ks4-aqa/units/fiction-science-fiction-writing/lessons",
    lessons: completeUnitLessons,
    onSave: () => console.log("Unsave unit 1"),
    isSaved: true,
  },
  {
    unitTitle: "Writing for Different Audiences",
    unitSlug: "writing-for-different-audiences",
    programmeSlug: "english-secondary-ks4-aqa",
    year: "Year 9",
    savedAt: "2025-04-15T14:30:00.199406+00:00",
    href: "/teachers/programmes/english-secondary-ks4-aqa/units/writing-for-different-audiences/lessons",
    lessons: incompleteUnitLessons,
    onSave: () => console.log("Unsave unit 2"),
    isSaved: true,
  },
  {
    unitTitle: "Poetry Analysis: Romanticism",
    unitSlug: "poetry-analysis-romanticism",
    programmeSlug: "english-secondary-ks4-aqa",
    year: "Year 11",
    savedAt: new Date().toISOString(),
    href: "/teachers/programmes/english-secondary-ks4-aqa/units/poetry-analysis-romanticism/lessons",
    lessons: completeUnitLessons.slice(0, 3), // Fewer lessons for variety
    onSave: () => console.log("Unsave unit 3"),
    isSaved: true,
  },
];

const meta: Meta<typeof MyLibrarySubjectCard> = {
  component: MyLibrarySubjectCard,
  tags: ["autodocs"],
  args: {
    subjectSlug: "english",
    savedUnits: sampleUnits,
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof MyLibrarySubjectCard>;

export const Default: Story = {
  render: (args) => (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MyLibrarySubjectCard {...args} />
    </OakThemeProvider>
  ),
};
