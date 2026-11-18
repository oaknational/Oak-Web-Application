import { Meta, StoryObj } from "@storybook/react";

import FaqsSection from "./FaqsSection";
import { basic } from "./FaqsSection.fixtures";

const meta = {
  title: "Components/GenericPagesComponents/FaqsSection",
  component: FaqsSection,
  tags: ["autodocs"],
} satisfies Meta<typeof FaqsSection>;

export default meta;

type Story = StoryObj<typeof FaqsSection>;

export const Default: Story = {
  args: basic,
};
