import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SpecialistProgrammeListing";

import { specialistProgrammeListingPageDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/specialistProgrammes.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SpecialistProgrammeListing: Story = {
  args: {
    ...specialistProgrammeListingPageDataFixture(),
  },
};
