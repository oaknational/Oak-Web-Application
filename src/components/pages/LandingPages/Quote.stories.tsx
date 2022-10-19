import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Quote as Component } from "./Quote";

export default {
  title: "Sanity/Pages/Landing Pages",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LandingPagesQuote = Template.bind({});
LandingPagesQuote.args = {
  text: "This is an inspiring quote",
  attribution: "I Wroteit",
};
