import { Meta } from "@storybook/nextjs";

import Component from "./SupportYourTeamBubbleMessage";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const BubbleMessage = {
  args: {
    variant: "bubble-1",
    outlineHeading: "3 hrs",
    heading: "per week saved on lesson planning",
    subHeading: "by nearly half of teachers using Oak",
  },
};

export const BubbleMessage2 = {
  args: {
    variant: "bubble-2",
    outlineHeading: "3 hrs",
    heading: "per week saved on lesson planning",
    subHeading: "by nearly half of teachers using Oak",
  },
};
