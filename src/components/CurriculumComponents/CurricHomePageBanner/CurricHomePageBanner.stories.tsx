import type { Meta, StoryObj } from "@storybook/react";

import CurricHomePageBanner from "./CurricHomePageBanner";

import { OakColorName } from "@/styles/theme";

const meta: Meta<typeof CurricHomePageBanner> = {
  component: CurricHomePageBanner,
};

export default meta;
type Story = StoryObj<typeof CurricHomePageBanner>;

export const Banner: Story = {
  args: {
    background: "lemon" as OakColorName,
    newText: "New exciting feature available!",
    ctaText: "Learn more",
    page: "home",
  },
  render: (args) => <CurricHomePageBanner {...args} />,
};
