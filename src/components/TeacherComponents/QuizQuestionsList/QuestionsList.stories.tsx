import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { QuizQuestionListProps } from "./QuestionsList";

import Component from ".";

import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const { starterQuiz } = lessonOverviewFixture();

const currentPageItems: QuizQuestionListProps = {
  questions: starterQuiz || [],
  imageAttribution: [],
  isMathJaxLesson: false,
};

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const LessonList = Template.bind({});

LessonList.args = currentPageItems;
