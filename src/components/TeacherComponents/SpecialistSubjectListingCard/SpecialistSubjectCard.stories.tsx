import type { Meta, StoryObj } from "@storybook/nextjs";

import { specialistSubjectListingFixture } from "../../TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.fixture";

import Component from "./SpecialistSubjectCard";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistSubjectCard: Story = {
  args: {
    backgroundColour: "aqua",
    subject: specialistSubjectListingFixture[0],
  },
};
