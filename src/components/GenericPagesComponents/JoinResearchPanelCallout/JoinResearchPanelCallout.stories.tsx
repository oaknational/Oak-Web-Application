import type { Meta, StoryObj } from "@storybook/nextjs";

import JoinResearchPanelCallout from "./index";

import { joinResearchPanelCalloutBlockFixture } from "@/__tests__/pages/about-us/get-involved/join-research-panel.fixtures";

const meta = {
  component: JoinResearchPanelCallout,
  title: "Components/GenericPagesComponents/JoinResearchPanelCallout",
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelCallout>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelCallout>;

export const Default: Story = {
  args: joinResearchPanelCalloutBlockFixture,
};
