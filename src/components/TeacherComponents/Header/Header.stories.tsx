import React from "react";
import { StoryObj, Meta } from "@storybook/react";
import {
  oakDefaultTheme,
  OakFlex,
  OakPrimaryButton,
  OakThemeProvider,
} from "@oaknational/oak-components";

import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  component: Header,
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
      include: [
        "background",
        "backgroundColorLevel",
        "layoutVariant",
        "subjectIcon",
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

type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    heading: "English Primary",
    summary:
      "This is a programme header component that displays content alongside a large subject illustration. On mobile, the image appears above the content, and on desktop, the image is displayed to the right. Text should wrap with balance for better readability.",
    bullets: ["Item 1", "Item 2", "Item 3"],
  },
};

export const RealisticExample: Story = {
  args: {
    heading: "Computing Secondary",
    summary:
      "Our computing curriculum is taught through real-world contexts, helping pupils understand how technology works, think critically and develop future-ready digital skills.",
    bullets: [
      "National curriculum-aligned, fully sequenced",
      "Practical, engaging lessons",
      "Responsible digital citizenship",
    ],
  },
};

export const WithBackgroundColour: Story = {
  args: {
    backgroundColorLevel: 1,
    heading: "History Secondary",
    summary:
      "This example shows the component with a decorative background color.",
    bullets: [],
  },
};

export const WithLongContent: Story = {
  args: {
    backgroundColorLevel: 5,
    heading: "Geography Secondary",
    summary:
      "This example demonstrates how the component handles longer content. The layout remains responsive and maintains proper spacing across different screen sizes. The subject illustration should always be prominently displayed. This is a programme header component that displays content alongside a large subject illustration. On mobile, the image appears above the content, and on desktop, the image is displayed to the right. Text should wrap with balance for better readability.",
    bullets: [
      "Item 1 is quite long and should wrap to the next line and be properly aligned with the text",
      "Item 2",
      "Item 3",
    ],
  },
};

export const WithHeaderAndFooterSlots: Story = {
  render: (args) => (
    <Header
      {...args}
      headerSlot={
        <OakFlex
          $pa="spacing-8"
          $alignItems="center"
          $height="spacing-32"
          $background="bg-decorative6-main"
        >
          Breadcrumb placeholder
        </OakFlex>
      }
      footerSlot={
        <OakFlex $gap="spacing-8">
          <OakPrimaryButton>Button 1</OakPrimaryButton>
          <OakPrimaryButton>Button 2</OakPrimaryButton>
          <OakPrimaryButton>Button 3</OakPrimaryButton>
        </OakFlex>
      }
    />
  ),
  args: {
    backgroundColorLevel: 5,
    heading: "Geography Secondary",
    summary:
      "This example demonstrates the `headerSlot` and `footerSlot` props. The headerSlot appears above the main content and is ideal for breadcrumbs. The footerSlot appears below the main content and is perfect for action buttons.",
    bullets: ["Item 1", "Item 2", "Item 3"],
  },
};
