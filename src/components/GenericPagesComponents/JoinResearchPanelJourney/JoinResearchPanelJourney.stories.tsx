import { Meta, StoryObj } from "@storybook/react";

import { basic as fixture } from "./fixtures";

import JoinResearchPanelJourney from ".";

const meta = {
  component: JoinResearchPanelJourney,
  title: "Components/GenericPagesComponents/JoinResearchPanelJourney",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelJourney>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelJourney>;

export const Default: Story = {
  args: {
    ...fixture,
  },
};
