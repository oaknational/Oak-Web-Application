import type { Meta, StoryObj } from "@storybook/nextjs";

import { PupilLessonOverviewContentGuidanceModal } from "./PupilLessonOverviewContentGuidanceModal";

const meta = {
  component: PupilLessonOverviewContentGuidanceModal,
  args: {
    redirectOverlayCleared: true,
    contentGuidanceDismissed: false,
    contentGuidanceCanOpen: true,
    isClassroomAssignment: false,
    onAccept: () => {},
    onDecline: () => {},
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 520,
      },
    },
  },
} satisfies Meta<typeof PupilLessonOverviewContentGuidanceModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ContentGuidance: Story = {
  args: {
    supervisionLevel: "Adult supervision recommended.",
    ageRestriction: null,
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

export const AgeRestrictionOnly: Story = {
  args: {
    contentGuidance: null,
    supervisionLevel: null,
    ageRestriction: "7_and_above",
  },
};

export const ClassroomAssignment: Story = {
  args: {
    ...ContentGuidance.args,
    isClassroomAssignment: true,
  },
};
