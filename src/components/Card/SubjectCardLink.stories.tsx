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
  imageProps: {
    src: "/images/illustrations/subject-art-and-design.svg",
    alt: "planning",
  },
  lessons: 130,
  units: 14,
  available: true,
};
