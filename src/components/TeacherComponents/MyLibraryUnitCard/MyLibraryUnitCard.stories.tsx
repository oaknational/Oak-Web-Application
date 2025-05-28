import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

export const completeUnitLessons = [
  {
    slug: "journey-to-the-centre-of-the-earth-explaining-how-a-writer-uses-sentence-structures-for-effect",
    order: 1,
    title:
      "Considering how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    state: "published",
  },
  {
    slug: "crafting-sentence-structures-to-create-specific-effects",
    order: 2,
    title:
      "Emulating how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    state: "published",
  },
  {
    slug: "using-punctuation-and-sentence-structures-to-create-impact",
    order: 3,
    title:
      "'The War of the Worlds': How punctuation and sentence structures create impact",
    state: "published",
  },
  {
    slug: "using-punctuation-to-create-specific-effects",
    order: 4,
    title:
      "Using punctuation to create specific effects in descriptive writing",
    state: "published",
  },
  {
    slug: "semantic-fields",
    order: 5,
    title: "Using semantic fields in a piece of creative writing",
    state: "published",
  },
];
export const incompleteUnitLessons = [
  {
    slug: "journey-to-the-centre-of-the-earth-explaining-how-a-writer-uses-sentence-structures-for-effect",
    order: 1,
    title:
      "Considering how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    state: "published",
  },
  {
    slug: "crafting-sentence-structures-to-create-specific-effects",
    order: 2,
    title:
      "Emulating how Verne uses sentences in ‘Journey to the Centre of the Earth’",
    state: "new",
  },
  {
    slug: "using-punctuation-and-sentence-structures-to-create-impact",
    order: 3,
    title:
      "'The War of the Worlds': How punctuation and sentence structures create impact",
    state: "new",
  },
  {
    slug: "using-punctuation-to-create-specific-effects",
    order: 4,
    title:
      "Using punctuation to create specific effects in descriptive writing",
    state: "new",
  },
  {
    slug: "semantic-fields",
    order: 5,
    title: "Using semantic fields in a piece of creative writing",
    state: "published",
  },
];
const unit = {
  unitTitle: "Fiction: Science Fiction Writing",
  unitSlug: "fiction-science-fiction-writing",
  programmeSlug: "english-secondary-ks4-aqa",
  year: "Year 10",
  savedAt: "2025-05-01T09:00:00.199406+00:00",
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
