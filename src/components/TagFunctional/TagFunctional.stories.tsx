import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { TagFunctional as Component } from "./TagFunctional";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const TagFunctional = Template.bind({});
TagFunctional.args = {
  text: "AQA",
};
