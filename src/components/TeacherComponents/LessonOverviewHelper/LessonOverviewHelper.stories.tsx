import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "@/components/TeacherComponents/LessonOverviewHelper/LessonOverviewHelper";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LessonOverviewHelper = Template.bind({});

LessonOverviewHelper.args = {
  supervisionLevel: "this is the helper description",
  equipment: [{ equipment: "this is the equipment description" }],
  contentGuidance: [
    {
      contentGuidanceLabel: "test label",
      contentGuidanceArea: "test area",
      contentGuidanceDescription: "test details",
    },
  ],
};
