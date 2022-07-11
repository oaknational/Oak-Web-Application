import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./DismissibleCard";

export default {
  title: "Cards/Dismmissible Card",
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Close to remove",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const DismissibleCard = Template.bind({});
