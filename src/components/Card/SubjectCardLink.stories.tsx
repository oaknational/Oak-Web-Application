import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SubjectCardLink";

export default {
  title: "Cards/Subject Card Link",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCard = Template.bind({});

SubjectCard.args = {
  titleTag: "h3",
  subjectTitle: "Art and Design",
  imageBackground: "teachersPastelYellow",
  background: "white",
  svgName: "SubjectArtAndDesign",
  totalLessons: 130,
  totalUnits: 14,
  available: true,
};
