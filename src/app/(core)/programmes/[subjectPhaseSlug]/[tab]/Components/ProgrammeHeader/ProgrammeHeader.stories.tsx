import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { subjectHeroImages } from "./getSubjectHeroImageUrl";
import { ProgrammeHeader } from "./ProgrammeHeader";

const meta: Meta<typeof ProgrammeHeader> = {
  component: ProgrammeHeader,
  tags: ["autodocs"],
  argTypes: {
    subject: {
      control: {
        type: "select",
      },
      options: Object.keys(subjectHeroImages),
    },
    background: {
      control: {
        type: "select",
      },
      options: [
        undefined,
        "bg-decorative1-main",
        "bg-decorative2-main",
        "bg-decorative3-main",
        "bg-decorative4-main",
        "bg-decorative5-main",
        "bg-decorative6-main",
      ],
    },
    subjectTitle: {
      control: {
        type: "text",
      },
    },
    phaseTitle: {
      control: {
        type: "text",
      },
    },
    schoolYear: {
      control: {
        type: "select",
      },
      options: [
        undefined,
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
      ],
    },
    keyStage: {
      control: {
        type: "select",
      },
      options: [undefined, "ks1", "ks2", "ks3", "ks4"],
    },
    examboardTitle: {
      control: {
        type: "select",
      },
      options: [
        undefined,
        "AQA",
        "Edexcel",
        "Edexcel B",
        "Eduqas",
        "OCR",
        "WJEC",
      ],
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
        "background",
        "subjectTitle",
        "phaseTitle",
        "schoolYear",
        "keyStage",
        "examboardTitle",
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
    subject: "english",
    subjectTitle: "English",
    phaseTitle: "Primary",
    summary:
      "This is a programme header component that displays content alongside a large subject illustration. On mobile, the image appears above the content, and on desktop, the image is displayed to the right. Text should wrap with balance for better readability.",
    bullets: ["Item 1", "Item 2", "Item 3"],
  },
};

export const WithSchoolYear: Story = {
  args: {
    subject: "science",
    subjectTitle: "Science",
    phaseTitle: "Secondary",
    schoolYear: "9",
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
    subject: "maths",
    subjectTitle: "Maths",
    phaseTitle: "Primary",
    keyStage: "ks2",
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
    subject: "science",
    subjectTitle: "Science",
    phaseTitle: "Secondary",
    examboardTitle: "AQA",
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
    subject: "maths",
    subjectTitle: "Maths",
    phaseTitle: "Secondary",
    schoolYear: "10",
    examboardTitle: "Edexcel",
    summary:
      "This example demonstrates the component with both a school year and exam board. For years 10 and 11, the exam board appears after the year in the heading.",
    bullets: [
      "National curriculum-aligned",
      "Progressive skill development",
      "Assessment-ready resources",
    ],
  },
};
