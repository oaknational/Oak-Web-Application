import { ComponentStory, ComponentMeta } from "@storybook/react";

import teachersKeyStageSubjectsFixture from "../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjects.fixture";

import Component from "./SubjectCardList";

export default {
  title: "Lists/SubjectCardList/SubjectCardList",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardList = Template.bind({});

SubjectCardList.args = {
  subjects: teachersKeyStageSubjectsFixture().subjects.filter(
    (subject) => subject.lessonCount
  ),
};

export const SubjectCardListUnavailable = Template.bind({});

SubjectCardListUnavailable.args = {
  subjects: teachersKeyStageSubjectsFixture().subjects.filter(
    (subject) => !subject.lessonCount
  ),
};
