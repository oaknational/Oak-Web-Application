import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./TitleCard";

export default {
  title: "Cards",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const TitleCard = Template.bind({});

TitleCard.args = {
  title: "Computer science",
  keyStage: "Key stage 4",
  keyStageSlug: "key-stage-4",
  iconName: "Rocket",
  background: "teachersHighlight",
};
