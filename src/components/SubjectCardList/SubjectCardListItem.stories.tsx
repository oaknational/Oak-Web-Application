import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SubjectCardListItem";

export default {
  title: "Lists/SubjectCardList/SubjectCardListItem",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardListItem = Template.bind({});

SubjectCardListItem.args = {
  titleTag: "h3",
  title: "Art and Design",
  svgName: "SubjectArtAndDesign",
  lessonCount: 130,
  unitCount: 14,
};

export const SubjectCardListItemUnavailable = Template.bind({});

SubjectCardListItemUnavailable.args = {
  titleTag: "h3",
  title: "Art and Design",
  svgName: "SubjectArtAndDesign",
  lessonCount: 0,
  unitCount: 14,
};
