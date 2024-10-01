import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { LandingPageQuote as Component } from "./LandingPageQuote";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const LandingPagesQuote = Template.bind({});
LandingPagesQuote.args = {
  text: "This is an inspiring quote",
  attribution: "I Wroteit",
};
