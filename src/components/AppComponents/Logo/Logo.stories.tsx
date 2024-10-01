import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    title: { defaultValue: "Oak Nayional Academy" },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const Logo = Template.bind({});
