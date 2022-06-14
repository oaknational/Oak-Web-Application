import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Foundations/Box",
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Box",
    },
    background: {
      defaultValue: "grey3",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Box = Template.bind({});
