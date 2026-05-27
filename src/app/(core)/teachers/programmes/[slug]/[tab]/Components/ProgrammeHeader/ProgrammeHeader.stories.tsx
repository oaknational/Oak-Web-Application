import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { subjectHeroImages } from "./getSubjectHeroImageUrl";
import { ProgrammeHeader } from "./ProgrammeHeader";

const meta: Meta<typeof ProgrammeHeader> = {
  component: ProgrammeHeader,
  tags: ["autodocs"],
  title: "App/Programmes/ProgrammeHeader",
  argTypes: {
    subject: {
      control: {
        type: "select",
      },
      options: Object.keys(subjectHeroImages),
    },
    backgroundColorLevel: {
      control: {
        type: "select",
      },
      options: [undefined, 1, 2, 3, 4, 5, 6],
    },
    heading: {
      control: {
        type: "text",
      },
    },
    useSubduedBackground: {
      control: {
        type: "boolean",
      },
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
      include: [
        "subject",
        "backgroundColorLevel",
        "heading",
        "useSubduedBackground",
        "summary",
        "bullets",
      ],
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

type Story = StoryObj<typeof ProgrammeHeader>;

export const Default: Story = {
  args: {
    layoutVariant: "large",
    subject: "english",
    heading: "English primary",
    summary:
      "This is a programme header component that displays content alongside a large subject illustration. On mobile, the image appears above the content, and on desktop, the image is displayed to the right. Text should wrap with balance for better readability.",
    bullets: ["Item 1", "Item 2", "Item 3"],
  },
};

export const WithSchoolYear: Story = {
  args: {
    layoutVariant: "large",
    subject: "science",
    heading: "Science year 9",
    summary:
      "This example demonstrates the component with a school year specified. When a school year is provided, the heading format changes to include 'year X' instead of the phase title.",
    bullets: [
      "Curriculum-aligned content",
      "Engaging practical activities",
      "Assessment support materials",
    ],
  },
};

export const WithKeyStage: Story = {
  args: {
    layoutVariant: "large",
    subject: "maths",
    heading: "Maths KS2",
    summary:
      "This example demonstrates the component with a key stage specified. When a key stage is provided, the heading format changes to include 'KS1', 'KS2', 'KS3', or 'KS4' instead of the phase title.",
    bullets: [
      "National curriculum-aligned",
      "Progressive skill development",
      "Assessment-ready resources",
    ],
  },
};

export const WithExamboard: Story = {
  args: {
    layoutVariant: "large",
    subject: "science",
    heading: "Science secondary AQA",
    summary:
      "This example demonstrates the component with an exam board specified. When an exam board is provided with KS4 or years 10-11, it appears in the heading after the key stage or year.",
    bullets: [
      "National curriculum-aligned",
      "Progressive skill development",
      "Assessment-ready resources",
    ],
  },
};

export const WithSchoolYearAndExamboard: Story = {
  args: {
    layoutVariant: "large",
    subject: "maths",
    heading: "Maths year 10 Edexcel",
    summary:
      "This example demonstrates the component with both a school year and exam board. For years 10 and 11, the exam board appears after the year in the heading.",
    bullets: [
      "National curriculum-aligned",
      "Progressive skill development",
      "Assessment-ready resources",
    ],
  },
};
