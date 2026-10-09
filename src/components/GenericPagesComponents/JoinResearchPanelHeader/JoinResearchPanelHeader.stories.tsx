import type { Meta, StoryObj } from "@storybook/nextjs";

import JoinResearchPanelHeader from "./index";

import { joinResearchPanelHeaderBlockFixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";

const meta: Meta<typeof JoinResearchPanelHeader> = {
  component: JoinResearchPanelHeader,
  title: "Generic Pages Components/Join Research Panel Header",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelHeader>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelHeader>;

export const Default: Story = {
  args: joinResearchPanelHeaderBlockFixture,
};
