import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./SubjectUnitLessonTitleCard";

export default {
  title: "Cards/Title card",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const TitleCardLesson = Template.bind({});

TitleCardLesson.args = {
  title: "Binary conversion",
  page: "lesson",
  keyStage: "Key stage 4",
  keyStageSlug: "key-stage-4",
  subject: "Computing",
  subjectSlug: "computing",
};

export const TitleCardUnit = Template.bind({});

TitleCardUnit.args = {
  title: "Data representation",
  page: "unit",
  keyStage: "Key stage 4",
  keyStageSlug: "key-stage-4",
};

export const TitleCardSubject = Template.bind({});

TitleCardSubject.args = {
  title: "Computer Science",
  page: "subject",
  keyStage: "Key stage 4",
  keyStageSlug: "key-stage-4",
  slug: "computer-science",
};
