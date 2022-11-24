import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SubjectHeadingCard";

export default {
  title: "Cards/Subject heading",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectHeadingCard = Template.bind({});

SubjectHeadingCard.args = {
  title: "Title",
  keyStage: "key stage 1",
  iconName: "Twitter",
  background: "teachersHighlight",
};
