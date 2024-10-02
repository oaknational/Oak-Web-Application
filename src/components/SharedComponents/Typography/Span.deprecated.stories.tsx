import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./Span.deprecated";

import Typography, { P } from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Typography>
    <P>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Id semper risus in
      hendrerit gravida rutrum quisque non tellus. Nibh praesent{" "}
      <Component {...args}>tristique magna sit.</Component> A arcu cursus vitae
      congue mauris rhoncus aenean. Turpis egestas maecenas pharetra convallis
      posuere morbi leo. Faucibus pulvinar elementum integer enim neque volutpat
      ac tincidunt. Vitae suscipit tellus mauris a diam maecenas.
    </P>
  </Typography>
);

export const Span = {
  render: Template,

  args: {
    fontWeight: 600,
    color: "inYourFace",
  },
};
