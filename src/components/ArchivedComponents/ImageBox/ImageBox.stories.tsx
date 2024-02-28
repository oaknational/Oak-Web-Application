import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "ImageBox",
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
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Box = Template.bind({});
