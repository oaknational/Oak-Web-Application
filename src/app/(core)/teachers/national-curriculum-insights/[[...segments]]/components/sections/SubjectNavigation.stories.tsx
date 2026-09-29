import type { Meta, StoryObj } from "@storybook/nextjs";

import { hubData, phaseData, subjectData } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsSubjectNavigation } from "./SubjectNavigation";

const meta = {
  component: NationalCurriculumInsightsSubjectNavigation,
  parameters: { layout: "fullscreen" },
  args: {
    data: subjectData,
    section: {
      __typename: "NationalCurriculumInsightsSubjectNavigationSection",
      phases: ["primary", "secondary"],
      primaryHeading: "Primary",
      secondaryHeading: "Secondary",
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsSubjectNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subject: Story = {};
export const Primary: Story = { args: { data: phaseData } };
export const Hub: Story = { args: { data: hubData } };
