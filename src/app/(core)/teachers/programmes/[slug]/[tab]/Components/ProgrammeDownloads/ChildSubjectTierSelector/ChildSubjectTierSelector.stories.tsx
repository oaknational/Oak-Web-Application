import React from "react";
import { StoryObj, Meta } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { ChildSubjectTierSelector } from "./ChildSubjectTierSelector";

const tiers = [
  { tier: "Foundation", tierSlug: "foundation" },
  { tier: "Higher", tierSlug: "higher" },
];

const childSubjects = [
  { subject: "Combined Science", subjectSlug: "combined-science" },
  { subject: "Physics", subjectSlug: "physics" },
  { subject: "Chemistry", subjectSlug: "chemistry" },
  { subject: "Biology", subjectSlug: "biology" },
];

const meta: Meta<typeof ChildSubjectTierSelector> = {
  tags: ["autodocs"],
  title: "App/Programmes/ProgrammeDownloads/ChildSubjectTierSelector",
  component: ChildSubjectTierSelector,
  argTypes: {
    tiers: {
      control: { type: "object" },
      description: "Foundation and higher as tier options",
    },
    childSubjects: {
      options: ["none", "childSubjects"],
      mapping: { none: undefined, childSubjects },
      control: { type: "select" },
      description: "None or Science",
    },
    getTierSubjectValues: {
      control: { type: "object" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChildSubjectTierSelector>;

export const Default: Story = {
  render: (args) => <ChildSubjectTierSelector {...args} />,
  args: {
    tiers,
    childSubjects,
    getTierSubjectValues: fn(),
  },
};
