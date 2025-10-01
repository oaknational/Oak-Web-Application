import type { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SpecialistProgrammeListing.view";
import { specialistProgrammeListing } from "./SpecialistProgrammeListing.fixture";
const meta: Meta<typeof Component> = {
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistProgrammeListingPage: Story = {
  args: {
    ...specialistProgrammeListing,
  },
};
