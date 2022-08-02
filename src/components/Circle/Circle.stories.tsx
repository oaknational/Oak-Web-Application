import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Foundations/Circle",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => (
  <Component size={72} $background="teachersPastelYellow">
    Hi!
  </Component>
);

export const Circle = Template.bind({});
export const CircleWithDropShadow = Template.bind({});
CircleWithDropShadow.args = {
  $dropShadow: "grey20",
};
