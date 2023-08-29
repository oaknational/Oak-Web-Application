import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";

import { KeyStageSubject } from "./SubjectCardList";
import Component from "./SubjectCardListItem";

export default {
  title: "Lists/SubjectCardList/SubjectCardListItem",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectCardListItem = Template.bind({});

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

SubjectCardListItem.args = {
  subject: subjects[0],
};

export const SubjectCardListItemUnavailable = Template.bind({});

SubjectCardListItemUnavailable.args = {
  subject: subjects[0],
  isAvailable: true,
};
