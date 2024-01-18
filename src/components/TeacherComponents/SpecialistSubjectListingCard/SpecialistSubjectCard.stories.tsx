import type { Meta, StoryObj } from "@storybook/react";

import { specialistSubjectListingFixture } from "../../TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.fixture";

import Component from "./SpecialistSubjectCard";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistUnitListingPage: Story = {
  args: {
    heading: "Specialist",
    subject: specialistSubjectListingFixture[0],
  },
};
