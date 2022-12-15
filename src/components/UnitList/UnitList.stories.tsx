import { ComponentStory, ComponentMeta } from "@storybook/react";

import { UnitListProps } from "./UnitList";
import { UnitListItemProps } from "./UnitListItem/UnitListItem";

import Component from ".";
const units: UnitListItemProps[] = [
  {
    title:
      "1, To build knowledge of the historical context of the play ‘Macbeth’",
    slug: "To-build-knowledge",
    themeTitle: "MacBeth",
    lessonCount: 4,
    quizCount: 0,
    subjectSlug: "english",
    keyStageSlug: "2",
  },
  {
    title:
      "1, To build knowledge of the historical context of the play ‘Macbeth’",
    slug: "To-build-knowledge",
    themeTitle: "MacBeth",
    lessonCount: 4,
    quizCount: 0,
    subjectSlug: "english",
    keyStageSlug: "2",
  },
];

const currentPageItems: UnitListProps = {
  units: units,
  currentPageItems: units,
  keyStageSlug: "4",
  subjectSlug: "computing",
  headingTag: "h1",
  tiers: [],
  tierSlug: null,
  paginationProps: {
    currentPage: 1,
    totalPages: 2,
  },
};

const tiers = [
  { title: "Foundation", slug: "foundation", unitCount: 14 },
  { title: "Core", slug: "core", unitCount: 14 },
  { title: "Higher", slug: "higher", unitCount: 14 },
];

export default {
  title: "Lists/Unit list",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UnitList = Template.bind({});

UnitList.args = currentPageItems;

export const UnitListTiers = Template.bind({});

UnitListTiers.args = {
  ...currentPageItems,
  tiers: tiers,
};
