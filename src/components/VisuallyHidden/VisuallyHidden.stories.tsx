import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./VisuallyHidden";

export default {
  title: "Accessibility/VisuallyHidden",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div>
    <Component {...args} />
  </div>
);

export const VisuallyHiddenExample = Template.bind({});

VisuallyHiddenExample.args = {};
