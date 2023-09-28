import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { TagFunctional as Component } from "./TagFunctional";

export default {
  title: "Element/Tag Functional",
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const TagFunctional = Template.bind({});
TagFunctional.args = {
  text: "AQA",
};
