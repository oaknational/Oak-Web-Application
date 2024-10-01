import { Meta } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import { KeyStageSubject } from "./SubjectCardList";
import Component from "./SubjectCardListItem";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

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

export const SubjectCardListItem = {
  args: {
    subject: subjects[0],
  },
};

export const SubjectCardListItemUnavailable = {
  args: {
    subject: subjects[0],
    isAvailable: true,
  },
};
