import type { Meta, StoryObj } from "@storybook/react";

import CurricHomePageBanner from "./CurricHomePageBanner";

const meta: Meta<typeof CurricHomePageBanner> = {
  component: CurricHomePageBanner,
};

export default meta;
type Story = StoryObj<typeof CurricHomePageBanner>;

export const Banner: Story = {
  args: {
    background: "lemon",
    newText: "New exciting feature available!",
    ctaText: "Learn more",
    page: "home",
  },
  render: (args) => <CurricHomePageBanner {...args} />,
};
