import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import CardListing from "./CardListing";

const meta: Meta<typeof CardListing> = {
  component: CardListing,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {
    layoutVariant: {
      control: {
        type: "radio",
        option: ["horizontal", "vertical"],
      },
    },
    subcopy: {
      control: {
        type: "text",
      },
    },
    lessonCount: {
      control: {
        type: "number",
      },
    },
    showSave: {
      control: {
        type: "boolean",
      },
    },
    isHighlighted: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof CardListing>;

export const Default: Story = {
  render: (args) => <CardListing {...args} />,
  args: {
    layoutVariant: "horizontal",
    isHighlighted: false,
    index: 10,
    title:
      "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
    tags: [
      { label: "Tag 1" },
      { label: "Tag 2" },
      { label: "Tag 3" },
      { label: "Tag 4" },
      { label: "Tag 5" },
      { label: "Tag 6" },
    ],
    showSave: true,
    lessonCount: 10,
  },
};
