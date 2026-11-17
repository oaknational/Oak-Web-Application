import type { Meta, StoryObj } from "@storybook/nextjs";

import { phaseData, subjectData } from "../../__fixtures__/stories";

import {
  NationalCurriculumInsightsKeyStageCards,
  NationalCurriculumInsightsPhaseCards,
} from "./JumpCards";

const meta = {
  component: NationalCurriculumInsightsPhaseCards,
  parameters: { layout: "fullscreen" },
  args: {
    data: subjectData,
    section: {
      __typename: "NationalCurriculumInsightsPhaseCardsSection",
      cards: [
        {
          phase: "primary",
          heading: "Primary Science",
          linkLabel: "Explore primary changes",
        },
        {
          phase: "secondary",
          heading: "Secondary Science",
          linkLabel: "Explore secondary changes",
        },
      ],
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsPhaseCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Phases: Story = {};
export const KeyStages: Story = {
  render: () => (
    <NationalCurriculumInsightsKeyStageCards
      data={phaseData}
      section={{
        __typename: "NationalCurriculumInsightsKeyStageCardsSection",
        cards: [
          {
            keyStage: "KS1",
            heading: "Key stage 1",
            linkLabel: "Explore key stage 1 changes",
          },
          {
            keyStage: "KS2",
            heading: "Key stage 2",
            linkLabel: "Explore key stage 2 changes",
          },
        ],
      }}
    />
  ),
};
