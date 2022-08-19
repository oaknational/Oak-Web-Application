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
  image: {
    imageSrc: "/images/illustrations/planning.svg",
    alt: "planning",
  },
  background: "grey7",
  summary: "A summary section.......",
};
