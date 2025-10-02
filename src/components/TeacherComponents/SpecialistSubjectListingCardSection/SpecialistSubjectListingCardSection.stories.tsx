import type { Meta, StoryObj } from "@storybook/nextjs";

import { specialistSubjectListingFixture } from "../../TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.fixture";

import Component from "./SpecialistSubjectListingCardSection";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistSubjectListingCardSection: Story = {
  args: {
    heading: "Specialist",
    summary: "This is a summary of the specialist subjects.",
    subjects: specialistSubjectListingFixture,
  },
};
