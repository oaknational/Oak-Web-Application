import type { Meta, StoryObj } from "@storybook/react";

import { specialistSubjectListingFixture } from "../../TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.fixture";

import Component from "./SpecialistSubjectCardSection";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistUnitListingPage: Story = {
  args: {
    heading: "Specialist",
    summary: "This is a summary of the specialist subjects.",
    subjects: specialistSubjectListingFixture,
  },
};
