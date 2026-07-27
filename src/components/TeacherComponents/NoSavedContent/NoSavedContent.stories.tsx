import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";

import NoSavedContent from "./NoSavedContent";

const meta: Meta<typeof NoSavedContent> = {
  component: NoSavedContent,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof NoSavedContent>;

export const Default: Story = {
  render: () => <NoSavedContent />,
};
