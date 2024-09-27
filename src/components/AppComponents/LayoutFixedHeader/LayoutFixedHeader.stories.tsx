import { StoryFn, Meta } from "@storybook/react";

import Component from "./LayoutFixedHeader";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Fixed Header",
    },
    background: { defaultValue: "grey40" },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const LayoutFixedHeader = Template.bind({});
