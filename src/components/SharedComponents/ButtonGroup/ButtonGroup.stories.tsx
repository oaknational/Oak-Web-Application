import React from "react";
import { OakTertiaryButton } from "@oaknational/oak-components";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./ButtonGroup";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args}>
    <OakTertiaryButton aria-label="Download Lesson" iconName="download">
      Download
    </OakTertiaryButton>
    <OakTertiaryButton aria-label="Share Lesson" iconName="share">
      Share
    </OakTertiaryButton>
  </Component>
);

export const ButtonGroup = {
  render: Template,
};
