import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  guidanceData,
  subjectData,
  storyImage,
  storyPortableText,
} from "../../__fixtures__/stories";

import { NationalCurriculumInsightsImageText } from "./ImageText";

const meta = {
  component: NationalCurriculumInsightsImageText,
  parameters: { layout: "fullscreen" },
  args: {
    data: subjectData,
    section: {
      __typename: "NationalCurriculumInsightsImageTextSection",
      heading: "Support for curriculum planning",
      bodyPortableText: storyPortableText(
        "Explore practical guidance for your school.",
      ),
      image: storyImage,
      imagePosition: "left",
      background: "white",
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsImageText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageLeft: Story = {};
export const ImageRight: Story = {
  args: { section: { ...meta.args.section, imagePosition: "right" } },
};
export const GuidanceBenefits: Story = {
  args: {
    data: guidanceData,
    section: {
      ...meta.args.section,
      heading: "As the refreshed national curriculum develops, you’ll get:",
      mirrorImage: true,
    },
  },
};
