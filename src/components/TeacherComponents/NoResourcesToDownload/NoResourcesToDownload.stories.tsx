import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = () => {
  return <Component />;
};

export const DetailsCompleted = {
  render: Template,
};
