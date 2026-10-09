import type { Meta, StoryObj } from "@storybook/nextjs";

import joinResearchPanelHeaderFixture from "./JoinResearchPanelHeader.fixtures";

import JoinResearchPanelHeader from "./index";

const meta: Meta<typeof JoinResearchPanelHeader> = {
  component: JoinResearchPanelHeader,
  title: "Generic Pages Components/Join Research Panel Header",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelHeader>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelHeader>;

export const Default: Story = {
  args: joinResearchPanelHeaderFixture,
};
