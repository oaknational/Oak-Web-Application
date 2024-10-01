import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./PupilTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const PupilTab = Template.bind({});
