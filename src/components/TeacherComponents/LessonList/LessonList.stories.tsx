import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import { LessonListProps } from "./LessonList";

import Component from ".";

import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

const { lessons, ...unit } = lessonListingFixture();
const lessonsWithUnitData = lessons.map((lesson) => ({
  ...lesson,
  ...unit,
}));

const currentPageItems: LessonListProps = {
  lessonCount: lessons.length,
  lessonCountHeader: `Lessons (${lessons.length})`,
  currentPageItems: lessonsWithUnitData,
  keyStageSlug: "4",
  subjectSlug: "computing",
  headingTag: "h2",
  paginationProps: {
    onPageChange: () => {},
    paginationRoute: "/",
    isFirstPage: true,
    isLastPage: false,
    prevHref: "/",
    nextHref: "/",
    currentPage: 1,
    totalPages: 2,
    totalResults: 10,
    pageSize: 5,
  },
  unitTitle: "Unit title",
  onClick: function (): void {
    console.log("Click");
  },
};

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const LessonList = {
  render: Template,
  args: currentPageItems,
};
