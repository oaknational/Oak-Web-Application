import { Meta, StoryObj } from "@storybook/react";

import Component from "./SubjectProgrammeListing";

import { programmeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierAndExamboardListing.fixture";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectProgrammeListing: Story = {
  args: {
    ...programmeListingFixture(),
  },
};
