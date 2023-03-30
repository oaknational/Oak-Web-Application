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
  subjectSlug: "maths",
  subjectName: "Maths",
  keyStageSlug: "ks4",
  keyStageName: "Key stage 4",
  tiers: [
    {
      title: "Foundation",
      slug: "foundation",
      unitCount: 3,
      lessonCount: 4,
    },
    {
      title: "Core",
      slug: "core",
      unitCount: 3,
      lessonCount: 4,
    },
    {
      title: "Higher",
      slug: "higher",
      unitCount: 3,
      lessonCount: 4,
    },
  ],
};
