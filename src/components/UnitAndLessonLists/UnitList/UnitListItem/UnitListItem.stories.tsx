import type { Meta, StoryObj } from "@storybook/react";

import AnalyticsDecorator from "../../../../storybook-decorators/AnalyticsDecorator";
import unitListingFixture from "../../../../node-lib/curriculum-api/fixtures/unitListing.fixture";

import UnitListItem, { UnitListItemProps } from "./UnitListItem";

const unitListing = unitListingFixture();
//@ts-expect-error : propData is not assignable to type 'UnitListItemProps' on account of ? in type
const propData = unitListing.units[0][0];

//@ts-expect-error: object is possibly 'undefined' but we know it's not
const props: UnitListItemProps = {
  ...propData,
  index: 123,
  hideTopHeading: true,
};

const meta: Meta<typeof UnitListItem> = {
  title: "Lists/Unit List Item",
  component: UnitListItem,
  decorators: [AnalyticsDecorator],
};

export default meta;

type Story = StoryObj<typeof UnitListItem>;

export const Standard: Story = {
  render: ({ ...args }) => <UnitListItem {...args} />,
  args: { ...props },
};
