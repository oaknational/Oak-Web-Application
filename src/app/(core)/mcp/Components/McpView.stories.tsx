import type { Meta, StoryObj } from "@storybook/nextjs";

import { McpView } from "./McpView";

const meta: Meta<typeof McpView> = {
  component: McpView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof McpView>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
