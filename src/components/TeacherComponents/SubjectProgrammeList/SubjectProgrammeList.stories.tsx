import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { tieredProgrammeListingFixture } from "@/node-lib/curriculum-api/fixtures/tierListing.fixture";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SubjectProgrammeList = Template.bind({});

SubjectProgrammeList.args = {
  ...tieredProgrammeListingFixture(),
};
