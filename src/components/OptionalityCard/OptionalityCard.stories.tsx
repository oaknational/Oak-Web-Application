import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";

import Component, { UnitOption } from "./OptionalityCard";

import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";

export default {
  title: "Lists/Optionality Card",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const OptionalityCard = Template.bind({});
const units = unitListingFixture().units;
const option1 = units[0] ? units[0][0] : null;
const option2 = units[1] ? units[1][0] : null;
const unitOptions = [option1, option2] as UnitOption[];

OptionalityCard.args = {
  unitOptions: unitOptions,
  index: 1,
};
