import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import lessonListingFixture from "../../../node-lib/curriculum-api/fixtures/lessonListing.fixture";
import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import { LessonListProps } from "./LessonList";

import Component from ".";

export default {
  title: "Lists/Lesson List",
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const { lessons, ...unit } = lessonListingFixture();
const lessonsWithUnitData = lessons.map((lesson) => ({
  ...lesson,
  ...unit,
}));

const currentPageItems: LessonListProps = {
  lessonCount: lessons.length,
  currentPageItems: lessonsWithUnitData,
  keyStageSlug: "4",
  subjectSlug: "computing",
  headingTag: "h2",
  paginationProps: {
    currentPage: 1,
    totalPages: 2,
    totalResults: 10,
    pageSize: 5,
  },
  unitTitle: "Unit title",
};

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const LessonList = Template.bind({});

LessonList.args = currentPageItems;
