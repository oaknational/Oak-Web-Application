import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./TeachersTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <Component {...args} keyStages={keyStageKeypad.keyStages} />
);

export const TeachersTab = {
  render: Template,
};
