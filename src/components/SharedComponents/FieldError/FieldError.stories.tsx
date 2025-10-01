import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./FieldError";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <>
    <Component {...args} />
  </>
);

export const FieldError = {
  render: Template,

  args: {
    id: "error id",
    children: "Display error here",
  },
};
