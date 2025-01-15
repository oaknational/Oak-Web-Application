import { OakBox } from "@oaknational/oak-components";
import { StoryFn, Meta } from "@storybook/react";

import Component, { ASPECT_RATIOS } from "./AspectRatio";

export default {
  component: Component,
  argTypes: {
    ratio: { control: { type: "select", options: ASPECT_RATIOS } },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <OakBox $background="black" $width={"all-spacing-16"} $position="relative">
    <Component {...args} />
  </OakBox>
);

export const AspectRatio = {
  render: Template,

  args: {
    ratio: "1:1",
  },
};
