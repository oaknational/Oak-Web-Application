import type { Meta, StoryObj } from "@storybook/nextjs";

import {
  phaseData,
  storyImage,
  storyPortableText,
  subjectData,
} from "../../__fixtures__/stories";

import { NationalCurriculumInsightsHeadlines } from "./Headlines";

const meta = {
  component: NationalCurriculumInsightsHeadlines,
  parameters: { layout: "fullscreen" },
  args: {
    data: subjectData,
    section: {
      __typename: "NationalCurriculumInsightsOverviewSection",
      heading: "The headlines in 60 seconds",
      bodyPortableText: storyPortableText(
        "Explore what's changing, what's staying the same and how learning builds across the curriculum.",
      ),
      quote: {
        quote:
          "Clear progression helps teachers make stronger links between topics and build on what pupils already know.",
        attribution: "Subject lead",
        role: "Science Subject Lead",
        image: storyImage,
      },
    },
  },
} satisfies Meta<typeof NationalCurriculumInsightsHeadlines>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subject: Story = {};
export const Phase: Story = { args: { data: phaseData } };
export const KeyStage: Story = {
  args: {
    data: {
      ...phaseData,
      route: {
        kind: "subjectPhaseKeyStage",
        subjectSlug: "science",
        phase: "primary",
        keyStageSlug: "key-stage-1",
      },
    },
  },
};
export const WithoutQuote: Story = {
  args: { section: { ...meta.args.section, quote: null } },
};
