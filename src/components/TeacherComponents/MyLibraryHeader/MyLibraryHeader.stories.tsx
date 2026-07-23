import React from "react";
import { Meta, StoryObj } from "@storybook/nextjs";

import MyLibraryHeader from "./MyLibraryHeader";

const meta: Meta<typeof MyLibraryHeader> = {
  component: MyLibraryHeader,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MyLibraryHeader>;

export const Default: Story = {
  render: () => <MyLibraryHeader />,
};
