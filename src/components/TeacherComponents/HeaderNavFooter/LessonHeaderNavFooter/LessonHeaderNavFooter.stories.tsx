import React from "react";
import { StoryObj, Meta } from "@storybook/nextjs";
import { OakPrimaryButton } from "@oaknational/oak-components";

import { LessonHeaderNavFooter } from "./LessonHeaderNavFooter";

const meta: Meta<typeof LessonHeaderNavFooter> = {
  component: LessonHeaderNavFooter,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LessonHeaderNavFooter>;

export const Default: Story = {
  args: {
    backgroundColorLevel: 1,
    prevHref: "www.google.com",
    nextHref: "www.google.com",
    viewHref: "www.google.com",
    downloadButton: <OakPrimaryButton>Action</OakPrimaryButton>,
  },
};
