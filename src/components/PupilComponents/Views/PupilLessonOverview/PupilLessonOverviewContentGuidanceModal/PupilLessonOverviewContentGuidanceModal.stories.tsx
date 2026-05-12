import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewContentGuidanceModal } from "./PupilLessonOverviewContentGuidanceModal";

const meta = {
  component: PupilLessonOverviewContentGuidanceModal,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
  args: {
    redirectOverlayCleared: true,
    contentGuidanceDismissed: false,
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
