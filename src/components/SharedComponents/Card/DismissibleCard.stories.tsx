import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./DismissibleCard";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Close to remove",
    },
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const DismissibleCard = Template.bind({});
