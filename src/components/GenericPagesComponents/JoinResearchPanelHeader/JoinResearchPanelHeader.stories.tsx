import type { Meta, StoryObj } from "@storybook/nextjs";

import { basic } from "./JoinResearchPanelHeader.fixtures";

import JoinResearchPanelHeader from "./index";

const meta: Meta<typeof JoinResearchPanelHeader> = {
  component: JoinResearchPanelHeader,
  title: "Components/GenericPagesComponents/JoinResearchPanelHeader",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelHeader>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelHeader>;

export const Default: Story = {
  args: basic,
};
