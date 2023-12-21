import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Fixed Header",
    },
    background: { defaultValue: "grey40" },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const FixedHeader = Template.bind({});
