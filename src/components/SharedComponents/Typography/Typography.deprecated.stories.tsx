import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./Typography.deprecated";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args}>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Id semper risus in
      hendrerit gravida rutrum quisque non tellus. Nibh praesent tristique magna
      sit. A arcu cursus vitae congue mauris rhoncus aenean. Turpis egestas
      maecenas pharetra convallis posuere morbi leo. Faucibus pulvinar elementum
      integer enim neque volutpat ac tincidunt. Vitae suscipit tellus mauris a
      diam maecenas.
    </p>
    <p>
      Faucibus a pellentesque sit amet porttitor eget dolor morbi non. Tortor
      vitae purus faucibus ornare. Bibendum est ultricies integer quis auctor
      elit. Massa id neque aliquam vestibulum morbi. Gravida neque convallis a
      cras semper auctor neque vitae. Massa tempor nec feugiat nisl pretium
      fusce id velit ut. Volutpat ac tincidunt vitae semper quis lectus nulla at
      volutpat. Id porta nibh venenatis cras sed felis eget. Pulvinar mattis
      nunc sed blandit libero volutpat sed cras. A diam maecenas sed enim ut sem
      viverra.
    </p>
  </Component>
);

export const Typography = {
  render: Template,

  args: {
    color: "grey70",
  },
};
