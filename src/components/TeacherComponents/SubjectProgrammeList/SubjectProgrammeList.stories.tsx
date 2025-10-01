import { Meta } from "@storybook/nextjs";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
} as Meta<typeof Component>;

export const ProgrammeList = {
  args: {
    ...programmeListingFixture(),
  },
};
