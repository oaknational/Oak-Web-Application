import { Meta, StoryObj } from "@storybook/react";

import JoinResearchPanelFaqs from "./JoinResearchPanelFaqs";
import { basic } from "./JoinResearchPanelFaqs.fixtures";

const meta = {
  title: "Components/GenericPagesComponents/JoinResearchPanelFaqs",
  component: JoinResearchPanelFaqs,
  tags: ["autodocs"],
} satisfies Meta<typeof JoinResearchPanelFaqs>;

export default meta;

type Story = StoryObj<typeof JoinResearchPanelFaqs>;

export const Default: Story = {
  args: basic,
};
