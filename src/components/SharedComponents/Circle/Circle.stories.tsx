import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    size: {
      defaultValue: 72,
    },
    $background: {
      defaultValue: "lemon50",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (props) => (
  <Component {...props}>Hi!</Component>
);

export const Circle = Template.bind({});
export const CircleWithDropShadow = Template.bind({});
CircleWithDropShadow.args = {
  $dropShadow: "grey20",
};
