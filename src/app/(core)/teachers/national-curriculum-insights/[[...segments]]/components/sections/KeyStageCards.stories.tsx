import type { Meta, StoryObj } from "@storybook/nextjs";

import { phaseData } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsKeyStageCards } from "./KeyStageCards";

const meta = {
  component: NationalCurriculumInsightsKeyStageCards,
  parameters: { layout: "fullscreen" },
  args: {
    data: phaseData,
    section: {
      __typename: "NationalCurriculumInsightsKeyStageCardsSection",
      cards: [
        { keyStage: "KS1", heading: "KS1 Science curriculum changes" },
        { keyStage: "KS2", heading: "KS2 Science curriculum changes" },
        { keyStage: "KS3", heading: "KS3 Science curriculum changes" },
        { keyStage: "KS4", heading: "KS4 Science curriculum changes" },
      ],
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsKeyStageCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = {
  args: {
    data: {
      ...phaseData,
      activeTab: "secondary",
      route: {
        kind: "subjectPhase",
        subjectSlug: "science",
        phase: "secondary",
      },
    },
  },
};
