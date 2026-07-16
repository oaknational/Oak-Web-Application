import React from "react";
import { StoryObj, Meta } from "@storybook/nextjs";
import {
  oakDefaultTheme,
  OakPrimaryButton,
  OakThemeProvider,
} from "@oaknational/oak-components";

import { UnitHeaderNavFooter } from "./UnitHeaderNavFooter";

const meta: Meta<typeof UnitHeaderNavFooter> = {
  component: UnitHeaderNavFooter,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof UnitHeaderNavFooter>;

export const Default: Story = {
  args: {
    backgroundColorLevel: 3,
    prevHref: "www.google.com",
    nextHref: "www.google.com",
    viewHref: "www.google.com",
    title: "Unit title",
    downloadButton: () => <OakPrimaryButton>Action</OakPrimaryButton>,
  },
};

export const Stuck: Story = {
  args: {
    ...Default.args,
    isStuck: true,
  },
};
