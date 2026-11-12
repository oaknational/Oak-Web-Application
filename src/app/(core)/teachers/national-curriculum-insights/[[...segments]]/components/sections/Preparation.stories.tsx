import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import { storyImage } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsPreparation } from "./Preparation";

// Statement and portrait source: approved Figma node 2521:79438.
const meta = {
  component: NationalCurriculumInsightsPreparation,
  parameters: { layout: "fullscreen" },
  args: {
    variant: "keyStage",
    section: {
      __typename: "NationalCurriculumInsightsPreparationSection",
      heading: "3 steps to get ready",
      steps: [
        {
          id: "mapping",
          text: "Map your current KS1 topics against the new history entitlement to see what already fits, what needs adapting and where the gaps are.",
        },
        {
          id: "progression",
          text: "Plan how chronology builds across the key stage, using a shared timeline so pupils can see how each new unit connects to what came before.",
        },
        {
          id: "sources",
          text: "Choose a local history study and gather sources for every unit, such as artefacts, photographs and first-hand accounts pupils can explore.",
        },
      ],
      attribution: "Emma McCrea",
      role: "Head of Curriculum Design",
      image: {
        ...storyImage,
        asset: {
          _id: "figma-preparation-portrait",
          url: "/images/national-curriculum-insights/preparation-author.png",
        },
      },
    },
  },
  render: (args) => (
    <OakFlex $maxWidth="spacing-960" $width="100%">
      <NationalCurriculumInsightsPreparation {...args} />
    </OakFlex>
  ),
} satisfies Meta<typeof NationalCurriculumInsightsPreparation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const KeyStage: Story = {};
export const Phase: Story = { args: { variant: "phase" } };
