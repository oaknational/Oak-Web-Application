import type { Meta, StoryObj } from "@storybook/nextjs";

import { NationalCurriculumInsightsChecklist } from "./Checklist";

import type { NationalCurriculumInsightsModule } from "@/common-lib/cms-types/nationalCurriculumInsights";
type ChecklistSection = Extract<
  NationalCurriculumInsightsModule,
  { __typename: "NationalCurriculumInsightsChecklistSection" }
>;

const teacher = {
  __typename: "NationalCurriculumInsightsChecklistSection",
  audience: "teacher",
  heading: "Teacher checklist",
  items: [
    {
      id: "action-0",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Existing WAU topics will need to be checked against the new history entitlement rather than assumed to provide sufficient coverage.",
            },
          ],
        },
      ],
    },
    {
      id: "action-1",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Teachers will need to ensure that KS1 together build a coherent chronological foundation, including the first humans and Stone Age.",
            },
          ],
        },
      ],
    },
    {
      id: "action-2",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Local history will need to be planned deliberately, with links between the locality and wider historical developments.",
            },
          ],
        },
      ],
    },
    {
      id: "action-3",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Planning will need to distinguish more clearly between what pupils should know about the past and what they should know about historical knowledge.",
            },
          ],
        },
      ],
    },
    {
      id: "action-4",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Teacher subject knowledge and curriculum-aligned resources are likely to become more important because the content is more specific than under the current curriculum.",
            },
          ],
        },
      ],
    },
  ],
} satisfies ChecklistSection;
const leader = {
  __typename: "NationalCurriculumInsightsChecklistSection",
  audience: "schoolLeader",
  heading: "School leaders checklist",
  items: [
    {
      id: "action-0",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Identify gaps, especially the first humans, early migrations, Stone Age content and explicit local history.",
            },
          ],
        },
      ],
    },
    {
      id: "action-1",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Check whether chronology is being built deliberately rather than through disconnected topics.",
            },
          ],
        },
      ],
    },
    {
      id: "action-2",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Review whether source work is tied to secure historical knowledge, not taught as a generic skill in isolation.",
            },
          ],
        },
      ],
    },
    {
      id: "action-3",
      contentPortableText: [
        {
          _type: "block",
          _key: "action",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "text",
              marks: [],
              text: "Decide which existing WAU topics can be retained, adapted or replaced if the draft framework is adopted.",
            },
          ],
        },
      ],
    },
  ],
} satisfies ChecklistSection;
const meta = {
  component: NationalCurriculumInsightsChecklist,
  parameters: { layout: "fullscreen" },
  args: { section: teacher, variant: "keyStage" },
} satisfies Meta<typeof NationalCurriculumInsightsChecklist>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TeacherKeyStage: Story = {};
export const TeacherPhase: Story = { args: { variant: "phase" } };
export const SchoolLeader: Story = { args: { section: leader } };
