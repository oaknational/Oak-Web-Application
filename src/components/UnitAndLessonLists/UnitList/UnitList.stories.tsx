import { ComponentStory, ComponentMeta } from "@storybook/react";

import teachersKeyStageSubjectUnitsFixture from "../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";

import { UnitListProps } from "./UnitList";

import Component from ".";

const currentPageItems: UnitListProps = {
  ...teachersKeyStageSubjectUnitsFixture(),
  currentPageItems: teachersKeyStageSubjectUnitsFixture().units.slice(0, 5),
  paginationProps: {
    currentPage: 1,
    totalPages: 2,
    pageSize: 20,
  },
};

export default {
  title: "Lists/Unit list",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UnitList = Template.bind({});

UnitList.args = currentPageItems;

const tiers = [
  { title: "Foundation", slug: "foundation", unitCount: 14, lessonCount: 16 },
  { title: "Core", slug: "core", unitCount: 14, lessonCount: 16 },
  { title: "Higher", slug: "higher", unitCount: 14, lessonCount: 16 },
];
export const UnitListTiers = Template.bind({});

UnitListTiers.args = {
  ...currentPageItems,
  tiers: tiers,
};
