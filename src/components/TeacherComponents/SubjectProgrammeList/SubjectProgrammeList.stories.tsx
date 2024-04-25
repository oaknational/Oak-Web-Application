import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const ProgrammeList = Template.bind({});

ProgrammeList.args = {
  ...programmeListingFixture(),
};
