import { StoryFn, Meta } from "@storybook/nextjs";

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

export const Circle = {
  render: Template,
};

export const CircleWithDropShadow = {
  render: Template,

  args: {
    $dropShadow: "grey20",
  },
};
