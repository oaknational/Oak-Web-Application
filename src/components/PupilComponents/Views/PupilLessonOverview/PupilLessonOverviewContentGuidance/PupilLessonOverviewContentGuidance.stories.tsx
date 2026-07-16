import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonOverviewContentGuidance } from "./PupilLessonOverviewContentGuidance";

const meta = {
  component: PupilLessonOverviewContentGuidance,
} satisfies Meta<typeof PupilLessonOverviewContentGuidance>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: "Content guidance",
    supervisionLevel: "Adult supervision recommended.",
    contentGuidance: [
      {
        contentguidanceLabel: "Depiction",
        contentguidanceArea: "Violence",
        contentguidanceDescription: "Contains references to conflict.",
      },
      {
        contentguidanceLabel: "Themes",
        contentguidanceArea: "Loss",
        contentguidanceDescription: "Discusses bereavement in context.",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    contentGuidance: [],
  },
};
