import type { Meta, StoryObj } from "@storybook/nextjs";

import { storyImage, storyPortableText } from "../../__fixtures__/stories";

import { NationalCurriculumInsightsGuidanceIntro } from "./GuidanceIntro";

const meta = {
  component: NationalCurriculumInsightsGuidanceIntro,
  parameters: { layout: "fullscreen" },
  args: {
    section: {
      __typename: "NationalCurriculumInsightsGuidanceIntroSection",
      heading: "Here, you’ll find:",
      statusLabel: "Coming soon",
      image: storyImage,
      bodyPortableText: [
        ...storyPortableText("Practical guidance for school leaders."),
        ...storyPortableText(
          "Subject insights to support your curriculum planning.",
        ).map((block) => ({ ...block, _key: "second-paragraph" })),
      ],
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsGuidanceIntro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithStatus: Story = {};
export const WithoutStatus: Story = {
  args: { section: { ...meta.args.section, statusLabel: null } },
};
