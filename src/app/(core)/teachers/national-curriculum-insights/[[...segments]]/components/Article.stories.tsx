import type { Meta, StoryObj } from "@storybook/nextjs";

import { phaseData } from "../__fixtures__/stories";

import { NationalCurriculumInsightsArticle } from "./Article";
import { NationalCurriculumInsightsDownload } from "./Download";
import downloadMeta from "./Download.stories";
import changesMeta from "./sections/Changes.stories";
import unchangedMeta from "./sections/Unchanged.stories";
import checklistMeta, { SchoolLeader } from "./sections/Checklist.stories";
import { NationalCurriculumInsightsChanges } from "./sections/Changes";
import { NationalCurriculumInsightsUnchanged } from "./sections/Unchanged";
import { NationalCurriculumInsightsChecklist } from "./sections/Checklist";

const meta = {
  component: NationalCurriculumInsightsArticle,
  parameters: { layout: "fullscreen" },
  args: {
    heading: "KS1 [subject]",
    hasDownload: true,
    sections: [
      {
        id: "changes",
        label: "What's changed",
        content: <NationalCurriculumInsightsChanges {...changesMeta.args} />,
      },
      {
        id: "unchanged",
        label: "What's stayed the same",
        content: (
          <NationalCurriculumInsightsUnchanged {...unchangedMeta.args} />
        ),
      },
      {
        id: "teacher",
        label: "Teacher checklist",
        content: (
          <NationalCurriculumInsightsChecklist {...checklistMeta.args} />
        ),
      },
      {
        id: "leader",
        label: "School leader checklist",
        content: (
          <NationalCurriculumInsightsChecklist
            section={SchoolLeader.args!.section!}
            variant="keyStage"
          />
        ),
      },
    ],
  },
  render: (args) => (
    <>
      <NationalCurriculumInsightsArticle {...args} />
      <NationalCurriculumInsightsDownload
        section={downloadMeta.args.section}
        data={phaseData}
      />
    </>
  ),
} satisfies Meta<typeof NationalCurriculumInsightsArticle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const KeyStage: Story = {};
export const Phase: Story = {
  args: { heading: "Primary [subject]" },
};
