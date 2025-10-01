import { StoryFn, Meta } from "@storybook/nextjs";

import { UnitListProps } from "./UnitList";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import unitListingFixture, {
  unitListingWithTiers,
} from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

const currentPageItems: UnitListProps = {
  ...unitListingFixture(),
  lessonCount: 10,
  currentPageItems: unitListingFixture().units.slice(0, 5),
  paginationProps: {
    onPageChange: () => {},
    paginationRoute: "/",
    isFirstPage: true,
    isLastPage: false,
    nextHref: "/",
    prevHref: "/",
    currentPage: 1,
    totalPages: 2,
    pageSize: 20,
  },
  onClick: function (): void {
    console.log("Click");
  },
};

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UnitList = {
  render: Template,
  args: currentPageItems,
};

const currentPageItemsWithTiers: UnitListProps = {
  ...unitListingWithTiers(),
  lessonCount: 10,
  currentPageItems: unitListingWithTiers().units.slice(0, 5),
  paginationProps: {
    onPageChange: () => {},
    paginationRoute: "/",
    isFirstPage: true,
    isLastPage: false,
    nextHref: "/",
    prevHref: "/",
    currentPage: 1,
    totalPages: 2,
    pageSize: 20,
  },
  onClick: function (): void {
    console.log("Click");
  },
};

export const UnitListTiers = {
  render: Template,
  args: currentPageItemsWithTiers,
};
