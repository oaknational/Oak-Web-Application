import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import MyLibraryUnitCard from "./MyLibraryUnitCard";

import {
  completeUnitLessons,
  incompleteUnitLessons,
} from "@/fixtures/teachers/myLibrary/unitCard";

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
