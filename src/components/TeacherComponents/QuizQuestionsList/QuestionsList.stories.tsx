import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import { QuizQuestionListProps } from "./QuestionsList";

import Component from ".";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

const { starterQuiz } = lessonOverviewFixture();

const currentPageItems: QuizQuestionListProps = {
  questions: starterQuiz || [],
  imageAttribution: [],
  isMathJaxLesson: false,
};

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const LessonList = {
  render: Template,
  args: currentPageItems,
};
