import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./SupportYourTeamBubbleMessage";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const BubbleMessage = Template.bind({});
BubbleMessage.args = {
  variant: "bubble-1",
  outlineHeading: "3 hrs",
  heading: "per week saved on lesson planning",
  subHeading: "by nearly half of teachers using Oak",
};

export const BubbleMessage2 = Template.bind({});
BubbleMessage2.args = {
  variant: "bubble-2",
  outlineHeading: "3 hrs",
  heading: "per week saved on lesson planning",
  subHeading: "by nearly half of teachers using Oak",
};
