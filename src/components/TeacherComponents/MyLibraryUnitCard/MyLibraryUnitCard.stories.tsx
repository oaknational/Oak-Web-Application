import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

const completeUnitLessons = [
  {
    slug: "journey-to-the-centre-of-the-earth-explaining-how-a-writer-uses-sentence-structures-for-effect",
    order: 1,
    title:
      "Considering how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    _state: "published",
    lesson_uid: "LESS-SXDKH-H1472",
  },
  {
    slug: "crafting-sentence-structures-to-create-specific-effects",
    order: 2,
    title:
      "Emulating how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    _state: "published",
    lesson_uid: "LESS-HROSF-P1473",
  },
  {
    slug: "using-punctuation-and-sentence-structures-to-create-impact",
    order: 3,
    title:
      "'The War of the Worlds': How punctuation and sentence structures create impact",
    _state: "published",
    lesson_uid: "LESS-LJDDZ-N1474",
  },
  {
    slug: "using-punctuation-to-create-specific-effects",
    order: 4,
    title:
      "Using punctuation to create specific effects in descriptive writing",
    _state: "published",
    lesson_uid: "LESS-PDDEL-L1475",
  },
  {
    slug: "semantic-fields",
    order: 5,
    title: "Using semantic fields in a piece of creative writing",
    _state: "published",
    lesson_uid: "LESS-BFVFW-W1477",
  },
];
const incompleteUnitLessons = [
  {
    slug: "journey-to-the-centre-of-the-earth-explaining-how-a-writer-uses-sentence-structures-for-effect",
    order: 1,
    title:
      "Considering how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    _state: "published",
    lesson_uid: "LESS-SXDKH-H1472",
  },
  {
    slug: "crafting-sentence-structures-to-create-specific-effects",
    order: 2,
    title:
      "Emulating how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    _state: "new",
    lesson_uid: "LESS-HROSF-P1473",
  },
  {
    slug: "using-punctuation-and-sentence-structures-to-create-impact",
    order: 3,
    title:
      "'The War of the Worlds': How punctuation and sentence structures create impact",
    _state: "new",
    lesson_uid: "LESS-LJDDZ-N1474",
  },
  {
    slug: "using-punctuation-to-create-specific-effects",
    order: 4,
    title:
      "Using punctuation to create specific effects in descriptive writing",
    _state: "new",
    lesson_uid: "LESS-PDDEL-L1475",
  },
  {
    slug: "semantic-fields",
    order: 5,
    title: "Using semantic fields in a piece of creative writing",
    _state: "published",
    lesson_uid: "LESS-BFVFW-W1477",
  },
];
const unit = {
  index: 1,
  unitTitle: "Fiction: Science Fiction Writing",
  unitSlug: "fiction-science-fiction-writing",
  programmeSlug: "english-secondary-ks4-aqa",
  yearTitle: "Year 10",
  saveTime: "2025-05-01T09:00:00.199406+00:00",
  href: "/teachers/programmes/english-secondary-ks4-aqa/units/fiction-science-fiction-writing/lessons",
  onSave: () => console.log("onSave!"),
  isSaved: false,
};

const meta: Meta<typeof MyLibraryUnitCard> = {
  component: MyLibraryUnitCard,
  tags: ["autodocs"],
  args: {
    ...unit,
    lessons: completeUnitLessons,
  },
  argTypes: {
    index: {
      control: {
        type: "number",
      },
    },
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
    yearTitle: {
      control: {
        type: "text",
      },
    },
    lessons: {
      control: {
        type: "object",
      },
    },
    saveTime: {
      control: {
        type: "text",
      },
    },
    href: {
      control: {
        type: "text",
      },
    },
    isSaved: {
      control: {
        type: "boolean",
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
