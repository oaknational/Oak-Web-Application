import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import lessonListingFixture from "../../../node-lib/curriculum-api/fixtures/lessonListing.fixture";

import { LessonListProps } from "./LessonList";

import Component from ".";

export default {
  title: "Lists/Lesson List",
  component: Component,
} as ComponentMeta<typeof Component>;

const lessons = lessonListingFixture().lessons;

const currentPageItems: LessonListProps = {
  lessons,
  currentPageItems: lessons,
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
