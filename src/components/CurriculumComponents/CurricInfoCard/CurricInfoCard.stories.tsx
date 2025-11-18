import { Meta, StoryObj } from "@storybook/nextjs";

import CurricInfoCard from "./CurricInfoCard";

const meta: Meta<typeof CurricInfoCard> = {
  component: CurricInfoCard,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
    iconName: {
      control: "select",
      options: [
        "search",
        "video",
        "filter",
        "download",
        "home",
        "edit",
        "tag-promotional",
      ],
    },
  },
  parameters: {
    iconWidth: {
      default: "spacing-64",
    },
    iconHeight: {
      default: "spacing-72",
    },
    backgrounds: {
      default: "white",
    },
  },
};

export default meta;

type Story = StoryObj<typeof CurricInfoCard>;

export const Default: Story = {
  args: {
    children: "This is some information.",
    iconName: "search",
    background: "mint30",
  },
};
