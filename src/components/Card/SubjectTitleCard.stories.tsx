import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SubjectTitleCard";

export default {
  title: "Cards/Subject title",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectTitleCard = Template.bind({});

SubjectTitleCard.args = {
  title: "Title",
  keyStage: "key stage 1",
  iconName: "Twitter",
  background: "teachersHighlight",
};
