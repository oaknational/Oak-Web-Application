import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import { tieredProgrammeListingFixture } from "../../node-lib/curriculum-api/fixtures/tierListing.fixture";

import Component from ".";

export default {
  title: "Lists",
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const ProgrammeList = Template.bind({});

ProgrammeList.args = {
  ...tieredProgrammeListingFixture(),
};
