import type { Meta, StoryObj } from "@storybook/nextjs";

import { basic } from "./JoinResearchPanelCallout.fixtures";

import JoinResearchPanelCallout from "./index";

const meta = {
  component: JoinResearchPanelCallout,
  title: "Components/GenericPagesComponents/JoinResearchPanelCallout",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelCallout>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelCallout>;

export const Default: Story = {
  args: basic,
};
