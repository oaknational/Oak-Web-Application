import type { Meta, StoryObj } from "@storybook/react";

import HomePageBanner from "./CurricHomePageBanner";

import { OakColorName } from "@/styles/theme";

const meta: Meta<typeof HomePageBanner> = {
  component: HomePageBanner,
};

export default meta;
type Story = StoryObj<typeof HomePageBanner>;

export const Banner: Story = {
  args: {
    background: "lemon" as OakColorName,
    newText: "New exciting feature available!",
    ctaText: "Learn more",
    page: "home",
  },
  render: (args) => <HomePageBanner {...args} />,
};
