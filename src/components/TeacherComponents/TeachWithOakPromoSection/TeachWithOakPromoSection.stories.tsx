import { Meta, StoryObj } from "@storybook/nextjs";

import { TeachWithOakPromoSection } from "./TeachWithOakPromoSection";

const meta: Meta<typeof TeachWithOakPromoSection> = {
  component: TeachWithOakPromoSection,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
