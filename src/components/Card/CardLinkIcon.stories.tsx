import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./CardLinkIcon";

export default {
  title: "Cards/Card Link Icon",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const CardLinkIcon = Template.bind({});

CardLinkIcon.args = {
  title: "Title",
  href: "/",
  background: "teachersPastelYellow",
  titleTag: "h3",
};
