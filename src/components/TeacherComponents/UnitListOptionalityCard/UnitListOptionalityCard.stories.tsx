import { Meta, StoryObj } from "@storybook/nextjs";

import Component, { UnitOption } from "./UnitListOptionalityCard";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import unitListingFixture from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

const units = unitListingFixture().units;
const option1 = units[0] ? units[0][0] : null;
const option2 = units[1] ? units[1][0] : null;
const unitOptions = [option1, option2] as UnitOption[];

const meta: Meta<typeof Component> = {
  decorators: [AnalyticsDecorator],
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const UnitListOptionalityCard: Story = {
  args: {
    unitOptions: unitOptions,
    index: 1,
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
