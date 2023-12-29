import type { Meta, StoryObj } from "@storybook/react";

import HomePageBanner from "./Banner";

import Component from "@/components/Flex";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Banner: Story = {
  args: {},
  render: () => (
    <Component $flexDirection={"column"}>{HomePageBanner}</Component>
  ),
};
