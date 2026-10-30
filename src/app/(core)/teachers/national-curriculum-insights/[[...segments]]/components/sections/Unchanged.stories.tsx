import type { Meta, StoryObj } from "@storybook/nextjs";

import { storyPortableText } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsUnchanged } from "./Unchanged";

const meta = {
  component: NationalCurriculumInsightsUnchanged,
  parameters: { layout: "fullscreen" },
  args: {
    section: {
      __typename: "NationalCurriculumInsightsUnchangedSection",
      heading:
        "What's stayed the same in the [key stage] [subject] national curriculum?",
      contentPortableText: [
        ...storyPortableText(
          "There is continuity in the kinds of historical experiences pupils are expected to have. Key stage 1 pupils will still:",
        ),
        ...[
          "learn about people, places and events from the past",
          "notice similarities and differences between past and present",
          "use stories as an important way of encountering the past",
          "ask questions and use evidence or sources to find out about history",
          "make connections between history and their own locality.",
        ].flatMap((text, index) =>
          storyPortableText(text).map((block) => ({
            ...block,
            _key: `point-${index}`,
            listItem: "bullet",
            level: 1,
          })),
        ),
        ...storyPortableText(
          "The main change is therefore not that these familiar approaches disappear, but that the historical content and progression beneath them become much more explicit.",
        ).map((block) => ({ ...block, _key: "closing" })),
      ],
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsUnchanged>;
export default meta;
type Story = StoryObj<typeof meta>;
export const KeyStage: Story = {};
export const Phase: Story = {
  args: {
    section: {
      ...meta.args.section,
      heading:
        "What's stayed the same in the [phase] [subject] national curriculum?",
    },
  },
};
