import type { Meta, StoryObj } from "@storybook/nextjs";

import { hubData, phaseData, subjectData } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsSubjectPhaseChips } from "./SubjectPhaseChips";

const meta = {
  component: NationalCurriculumInsightsSubjectPhaseChips,
  parameters: { layout: "fullscreen" },
  args: {
    data: hubData,
    section: {
      __typename: "NationalCurriculumInsightsSubjectNavigationSection",
      variant: "phaseChips",
      heading: "See what's changing in your subject",
      phases: ["primary", "secondary"],
      primaryHeading: "Primary",
      secondaryHeading: "Secondary",
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsSubjectPhaseChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hub: Story = {};
export const Subject: Story = { args: { data: subjectData } };
export const Primary: Story = { args: { data: phaseData } };
