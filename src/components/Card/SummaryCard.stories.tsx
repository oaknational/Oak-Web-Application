import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SummaryCard";

export default {
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
  background: "lemon50",
};

export const SummaryCardImage = Template.bind({});

SummaryCardImage.args = {
  title: "Title",
  summaryPortableText: "A summary section.......",
  background: "lemon50",
};

export const SummaryCardCustomImageContainer = Template.bind({});

SummaryCardCustomImageContainer.args = {
  title: "Title",
  summaryPortableText: "A summary section.......",
  background: "teal",
  imageContainerProps: {
    $minHeight: 160,
  },
};
