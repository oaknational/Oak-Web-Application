import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Foundations/Flex",
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Flex box",
    },
    pa: { defaultValue: [20, 50, 100] },
    bg: { defaultValue: "calmAndWarm" },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Flex = Template.bind({});
