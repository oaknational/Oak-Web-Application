import { Meta, StoryObj } from "@storybook/nextjs";

import Component from "./SubjectProgrammeListing";

import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";

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
