import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SubjectTitleCard";

export default {
  title: "Cards",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectTitleCard = Template.bind({});

SubjectTitleCard.args = {
  title: "Computer Science",
  keyStage: "key Stage 4",
  keyStageSlug: "key-stage-4",
  iconName: "Twitter",
  background: "teachersHighlight",
};
