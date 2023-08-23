import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";

import Component from "./SubjectCardList";

import { KeyStageSubject } from "@/pages/beta/[viewType]/key-stages/[keyStageSlug]/subjects";

export default {
  title: "Lists/SubjectCardList/SubjectCardList",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardList = Template.bind({});

const subjects = [
  [
    {
      subjectSlug: "biology",
      subjectTitle: "Biology",
      lessonCount: 4,
      programmeSlug: "biology-secondary-ks4",
      unitCount: 1,
    },
  ],
] as unknown as KeyStageSubject[];

SubjectCardList.args = {
  subjects: subjects,
  isAvailable: true,
};

export const SubjectCardListUnavailable = Template.bind({});

SubjectCardListUnavailable.args = {
  subjects: subjects,
  isAvailable: false,
};
