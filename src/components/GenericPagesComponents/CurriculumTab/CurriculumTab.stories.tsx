import { Meta } from "@storybook/react";

import Component from "./CurriculumTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const CurriculumTab = {};
