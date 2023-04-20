import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Lists",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const TierList = Template.bind({});

TierList.args = {
  programmes: [
    {
      programmeSlug: "maths-secondary-ks4-core",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      slug: "maths",
      title: "Maths",
      tierSlug: "core",
      tierTitle: "Core",
      totalUnitCount: 61,
      activeLessonCount: 284,
    },
    {
      programmeSlug: "maths-secondary-ks4-foundation",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      slug: "maths",
      title: "Maths",
      tierSlug: "foundation",
      tierTitle: "Foundation",
      totalUnitCount: 63,
      activeLessonCount: 256,
    },
    {
      programmeSlug: "maths-secondary-ks4-higher",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      slug: "maths",
      title: "Maths",
      tierSlug: "higher",
      tierTitle: "Higher",
      totalUnitCount: 63,
      activeLessonCount: 275,
    },
  ],
};
