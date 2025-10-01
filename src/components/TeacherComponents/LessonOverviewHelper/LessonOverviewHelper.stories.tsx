import { Meta } from "@storybook/nextjs";

import Component from "@/components/TeacherComponents/LessonOverviewHelper/LessonOverviewHelper";

export default {
  component: Component,
} as Meta<typeof Component>;

export const LessonOverviewHelper = {
  args: {
    supervisionLevel: "this is the helper description",
    equipment: [{ equipment: "this is the equipment description" }],
    contentGuidance: [
      {
        contentGuidanceLabel: "test label",
        contentGuidanceArea: "test area",
        contentGuidanceDescription: "test details",
      },
    ],
  },
};
