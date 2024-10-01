import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Box",
    },
    background: {
      defaultValue: "grey40",
    },
    minWidth: {
      defaultValue: "50%",
    },
    minHeight: {
      defaultValue: 80,
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const Box = Template.bind({});
