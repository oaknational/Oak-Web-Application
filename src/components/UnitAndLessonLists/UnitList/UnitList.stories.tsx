import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";
import unitListingFixture from "../../../node-lib/curriculum-api/fixtures/unitListing.fixture";
import unitListingWithTiersFixture from "../../../node-lib/curriculum-api/fixtures/unitListingWithTiers.fixture";

import { UnitListProps } from "./UnitList";

import Component from ".";

const currentPageItems: UnitListProps = {
  ...unitListingFixture(),
  currentPageItems: unitListingFixture().units.slice(0, 5),
  paginationProps: {
    currentPage: 1,
    totalPages: 2,
    pageSize: 20,
  },
};

export default {
  title: "Lists/Unit list",
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UnitList = Template.bind({});

UnitList.args = currentPageItems;

const currentPageItemsWithTiers: UnitListProps = {
  ...unitListingWithTiersFixture(),
  currentPageItems: unitListingWithTiersFixture().units.slice(0, 5),
  paginationProps: {
    currentPage: 1,
    totalPages: 2,
    pageSize: 20,
  },
};

export const UnitListTiers = Template.bind({});

UnitListTiers.args = currentPageItemsWithTiers;
