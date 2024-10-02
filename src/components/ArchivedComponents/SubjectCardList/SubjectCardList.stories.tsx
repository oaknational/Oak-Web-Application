import { Meta } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component, { KeyStageSubject } from "./SubjectCardList";

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

export const SubjectCardList = {
  args: {
    subjects: subjects,
    isAvailable: true,
  },
};

export const SubjectCardListUnavailable = {
  args: {
    subjects: subjects,
    isAvailable: false,
  },
};
