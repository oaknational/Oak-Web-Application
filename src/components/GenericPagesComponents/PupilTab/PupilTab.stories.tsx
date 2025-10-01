import { Meta } from "@storybook/nextjs";

import Component from "./PupilTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const PupilTab = {};
