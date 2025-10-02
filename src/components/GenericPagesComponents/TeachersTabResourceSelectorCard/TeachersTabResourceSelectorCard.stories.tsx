import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./TeachersTabResourceSelectorCard";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component
    {...args}
    icon={"worksheet"}
    title="Worksheets"
    angle={2}
    $top={96}
  />
);

export const TeachersTabResourceSelectorCard = {
  render: Template,
};
