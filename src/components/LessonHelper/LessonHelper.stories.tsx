import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./";

export default {
  title: "Element/Lesson Helper ",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LessonHelper = Template.bind({});

LessonHelper.args = {
  helperDescription: "this is the helper description",
  helperIcon: "content-guidance",
  helperTitle: "this is the helper title",
};
