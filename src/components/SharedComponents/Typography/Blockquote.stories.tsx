import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import { Blockquote as Component } from "./Blockquote";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args} cite="https://www.huxley.net/bnw/four.html">
    &ldquo; Words can be like X-rays, if you use them properly—they’ll go
    through anything. You read and you’re pierced. &rdquo;
  </Component>
);

export const Blockquote = {
  render: Template,
};
