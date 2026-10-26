import type { Meta, StoryObj } from "@storybook/react";

import type { BlogsPreviewProps } from "./BlogsPreview";
import { basic } from "./BlogsPreview.fixtures";

import { BlogsPreview } from ".";

const meta = {
  component: BlogsPreview,
  title: "GenericPagesComponents/BlogsPreview",
  tags: ["autodocs"],
} satisfies Meta<BlogsPreviewProps>;

export default meta;

export const Default: StoryObj<BlogsPreviewProps> = {
  args: basic,
};
