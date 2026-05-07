import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { PupilLessonOverviewContentGuidance } from "./PupilLessonOverviewContentGuidance";

const meta = {
  component: PupilLessonOverviewContentGuidance,
  decorators: [
    (StoryComponent) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <StoryComponent />
      </OakThemeProvider>
    ),
  ],
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
