import { ComponentStory, ComponentMeta } from "@storybook/react";

import { portableTextFromString } from "../../../__tests__/__helpers__/cms";

import Component from "./AboutUsSummaryCard";

export default {
  title: "Cards/Summary Card/About Us Summary Card",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const AboutUsSummaryCard = Template.bind({});

AboutUsSummaryCard.args = {
  title: "Title",
  heading: "Heading",
  summaryPortableText: portableTextFromString(
    "We’re here to support great teaching. We’re an independent public body. We work in partnership to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach, and enabling pupils to access a high-quality curriculum."
  ),
};
