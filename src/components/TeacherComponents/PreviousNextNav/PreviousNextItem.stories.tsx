import { Meta, StoryObj } from "@storybook/nextjs";

import PreviousNextItem from "./PreviousNextItem";

const meta: Meta<typeof PreviousNextItem> = {
  component: PreviousNextItem,
  tags: ["autodocs"],
  args: {
    index: 1,
    backgroundColorLevel: 3,
    title:
      "Ullamcorper auctor volutpat turpis dictumst aliquam et et dui mattis ullamcorper.",
    navDirection: "prev",
    navItemType: "unit",
    href: "www.google.com",
  },
};
export default meta;

type Story = StoryObj<typeof PreviousNextItem>;

export const Default: Story = {};
