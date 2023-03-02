import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SummaryCard";

export default {
  title: "Cards/Summary Card",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SummaryCard = Template.bind({});

SummaryCard.args = {
  title: "Title",
  summaryPortableText: "A summary section.......",
  background: "teachersPastelYellow",
};

export const SummaryCardImage = Template.bind({});

SummaryCardImage.args = {
  title: "Title",
  summaryPortableText: "A summary section.......",
  background: "teachersPastelYellow",

};

export const SummaryCardCustomImageContainer = Template.bind({});

SummaryCardCustomImageContainer.args = {
  title: "Title",
  summaryPortableText: "A summary section.......",
  background: "teachersGreen",
  imageContainerProps: {
    $minHeight: 160,
  },
};
