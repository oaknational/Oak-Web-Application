import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SpecialistSubjectListing.view";
import {
  specialistSubjectListingFixture,
  therapiesSubjectListingFixture,
} from "./SpecialistSubjectListing.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistSubjectListingPage: Story = {
  args: {
    therapies: therapiesSubjectListingFixture,
    specialist: specialistSubjectListingFixture,
  },
};
