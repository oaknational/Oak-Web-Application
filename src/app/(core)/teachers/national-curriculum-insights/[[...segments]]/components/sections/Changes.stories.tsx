import type { Meta, StoryObj } from "@storybook/nextjs";

import { NationalCurriculumInsightsChanges } from "./Changes";

// Visible example copy comes from Kim's Source of Truth frame 2521:79366.
// Closed folds do not provide authored detail copy in that frame.
const meta = {
  component: NationalCurriculumInsightsChanges,
  parameters: { layout: "fullscreen" },
  args: {
    section: {
      __typename: "NationalCurriculumInsightsChangesSection",
      heading:
        "What's changed in the [key stage] [subject] national curriculum?",
      changes: [
        {
          id: "1",
          title:
            "History is separated from the broad World Around Us framework.",
          whyItMatters:
            "Teachers will need to plan for a recognisable history curriculum in KS1, rather than relying on a topic to cover several World Around Us strands at once.",
          detailPortableText: [
            {
              _type: "block",
              _key: "detail",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "text",
                  marks: [],
                  text: "The current key stage 1 curriculum is broad and does not prescribe a set list of history topics; there is no straightforward list of statutory historical content that has been removed. Instead, the main structural change is that the broad WAU entitlement is replaced by a much more specific history entitlement. Schools may therefore find that some existing topics no longer align closely with the new statutory sequence, while other familiar topics can still be used where they support the required content.",
                },
              ],
            },
          ],
        },
        {
          id: "2",
          title:
            "Chronological understanding is now a named expectation in KS1.",
          whyItMatters:
            "Pupils should leave KS1 able to place events and people in order, so timelines need planning across the year.",
          detailPortableText: [
            {
              _type: "block",
              _key: "detail",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "text",
                  marks: [],
                  text: "In the current framework, a single topic about the local area might count towards history, geography and science at the same time. That approach can still be useful, but under the new entitlement the history within it needs to be easy to identify. Teachers should be able to say which historical knowledge pupils are learning, how it builds on earlier units and how pupils will show what they know. Where a topic's history content is thin or incidental, schools may need to strengthen it or teach it as a separate unit.",
                },
              ],
            },
          ],
        },
        {
          id: "3",
          title: "Local history becomes a required part of the KS1 sequence.",
          whyItMatters:
            "Schools will need a local history study that links to the wider content, not a standalone one-off topic.",
          detailPortableText: [
            {
              _type: "block",
              _key: "detail",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "text",
                  marks: [],
                  text: "Example explanation. Replace with the subject lead’s approved content.",
                },
              ],
            },
          ],
        },
        {
          id: "4",
          title:
            "Pupils are expected to use sources to find out about the past.",
          whyItMatters:
            "Lessons should give pupils regular chances to handle objects, pictures and accounts, not just hear stories.",
          detailPortableText: [
            {
              _type: "block",
              _key: "detail",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "text",
                  marks: [],
                  text: "Example explanation. Replace with the subject lead’s approved content.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsChanges>;

export default meta;
type Story = StoryObj<typeof meta>;
export const KeyStage: Story = {};
export const Phase: Story = {
  args: {
    section: {
      ...meta.args.section,
      heading: "What's changed in the [phase] [subject] national curriculum?",
    },
  },
};

export const LongContent: Story = {
  args: {
    section: {
      ...meta.args.section,
      heading: "Curriculum".repeat(18),
      changes: Array.from({ length: 6 }, (_, index) => ({
        ...meta.args.section.changes[index % meta.args.section.changes.length]!,
        id: `long-${index}`,
        title:
          index === 0
            ? "Curriculum".repeat(18)
            : meta.args.section.changes[0]!.title,
        whyItMatters:
          index === 0
            ? "Curriculum".repeat(18)
            : meta.args.section.changes[0]!.whyItMatters,
      })),
    },
  },
};
