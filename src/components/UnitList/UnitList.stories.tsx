import { ComponentStory, ComponentMeta } from "@storybook/react";

import { UnitListProps } from "./UnitList";

import Component from ".";

const currentPageItems: UnitListProps = {
  units: [
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "2",
    },
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "2",
    },
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: true,
      subjectSlug: "english",
      keyStageSlug: "2",
    },
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "2",
    },
    {
      title:
        "1, To build knowledge of the historical context of the play ‘Macbeth’",
      slug: "To-build-knowledge",
      learningThemeTitle: "MacBeth",
      lessonCount: 4,
      hasUnitQuiz: false,
      subjectSlug: "english",
      keyStageSlug: "2",
    },
  ],
  keyStageSlug: "4",
  subjectSlug: "computing",
  headingTag: "h1",
  availableTiers: [],
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
  availableTiers: tiers,
};
