import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  OakBreadcrumbs,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";

import { Header } from "./Header";
import UnitHeader from "./UnitHeader";

const meta: Meta<typeof UnitHeader> = {
  component: UnitHeader,
  tags: ["autodocs"],
  argTypes: {
    backgroundColorLevel: {
      control: {
        type: "select",
      },
      options: [undefined, 1, 2, 3, 4, 5, 6],
    },
    summary: {
      control: {
        type: "text",
      },
    },
    bullets: {
      control: {
        type: "object",
      },
    },
  },
  parameters: {
    controls: {
      include: ["backgroundColorLevel"],
    },
  },
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    heading: "English Primary",
  },
};

export const WithSummaryAndBullets: Story = {
  args: {
    heading: "IT and the world of work",
    summary:
      "Our computing curriculum is taught through real-world contexts, helping pupils understand how technology works, think critically and develop future-ready digital skills.",
    bullets: [
      "National curriculum-aligned, fully sequenced",
      "Practical, engaging lessons",
      "Responsible digital citizenship",
    ],
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
  },
};

export const WithHeader: Story = {
  args: {
    heading: "IT and the world of work",
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    headerSlot: (
      <OakBreadcrumbs
        breadcrumbs={[
          {
            text: "Level 1",
            href: "www.google.com",
          },
          {
            text: "Level 2",
            href: "www.google.com",
          },
          {
            text: "Level 3",
            href: "www.google.com",
          },
          {
            text: "Level 4",
          },
        ]}
      />
    ),
  },
};

export const WithTags: Story = {
  args: {
    heading: "IT and the world of work",
    backgroundColorLevel: 3,
    subjectIcon: "subject-computer-science",
    tags: ["Tag 1", "Long tag name for number 2", "T3"],
    headerSlot: (
      <OakBreadcrumbs
        breadcrumbs={[
          {
            text: "Level 1",
            href: "www.google.com",
          },
          {
            text: "Level 2",
            href: "www.google.com",
          },
          {
            text: "Level 3",
            href: "www.google.com",
          },
          {
            text: "Level 4",
          },
        ]}
      />
    ),
  },
};
