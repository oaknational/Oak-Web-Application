import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./FieldError";

export default {
  title: "Form Fields/Field Error",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <>
    <Component {...args} />
  </>
);

export const FieldError = Template.bind({});

FieldError.args = {
  id: "error id",
  children: "Display error here",
};
