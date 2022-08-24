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
  summary: "A summary section.......",
  background: "grey7",
  cardImageProps: {
    imageSrc: "/images/illustrations/planning.png",
    alt: "planning",
  },
};
