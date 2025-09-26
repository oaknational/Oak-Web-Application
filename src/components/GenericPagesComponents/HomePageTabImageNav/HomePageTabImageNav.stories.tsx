import type { Meta, StoryObj } from "@storybook/nextjs";

import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav/HomePageTabImageNav";

const meta: Meta<typeof HomePageTabImageNav> = {
  component: HomePageTabImageNav,
  argTypes: {
    current: {
      control: { type: "select" },
      options: ["teachers", "curriculum", "ai", "pupils"],
    },
  },
  parameters: {
    controls: {
      include: ["current"],
      exclude: /\$[a-zA-Z]*/,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HomePageTabImageNav>;

export const Primary: Story = {
  args: {
    current: "teachers",
  },
};
