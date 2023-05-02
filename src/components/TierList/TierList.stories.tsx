import { ComponentStory, ComponentMeta } from "@storybook/react";

import tierListingFixture from "../../node-lib/curriculum-api/fixtures/tierListing.fixture";

import Component from ".";

export default {
  title: "Lists",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const TierList = Template.bind({});

TierList.args = {
  ...tierListingFixture(),
};
