import type { Meta, StoryObj } from "@storybook/react";

import { UnitListItemProps } from "../UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";

import { ExemplarUnitsProps } from "./ExemplarUnits";

import Component from ".";

import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta: Meta<typeof Component> = {
  title: "Lists/ExemplarUnits",
  component: Component,
  decorators: [AnalyticsDecorator, (Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof Component>;

const units = unitListingFixture()
  .units.slice(0, 10)
  .map((unit) => unit[0]) as unknown as UnitListItemProps[];

const exemplarUnitsProps: ExemplarUnitsProps = {
  heading: "Primary Units",
  subHeading: "View and download our early-release units.",
  color: "lavender50",
  quote: {
    text: "To find resources that tick all the boxes is quite unusual",
    author: "— Sophie Baker",
    occupation: "Class Teacher, St Agnes Academy",
  },
  units: units,
  viewType: "teachers-2023",
};

export const ExemplarUnits: Story = {
  args: exemplarUnitsProps,
  render: (args) => <Component {...args} />,
};
