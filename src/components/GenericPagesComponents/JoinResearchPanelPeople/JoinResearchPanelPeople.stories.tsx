import { Meta, StoryObj } from "@storybook/react";

import { basic as fixture } from "./fixtures";

import JoinResearchPanelPeople from ".";

const meta = {
  component: JoinResearchPanelPeople,
  title: "Components/GenericPagesComponents/JoinResearchPanelPeople",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelPeople>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelPeople>;

export const Default: Story = {
  args: {
    ...fixture,
  },
};
