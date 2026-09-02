import type { Meta, StoryObj } from "@storybook/react";

import { TeachWithOakDescription } from "./TeachWithOakDescription";

const meta = {
  component: TeachWithOakDescription,
} satisfies Meta<typeof TeachWithOakDescription>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {},
} satisfies Story;
