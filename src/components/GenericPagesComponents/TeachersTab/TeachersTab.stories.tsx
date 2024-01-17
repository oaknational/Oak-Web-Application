import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./TeachersTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} keyStages={keyStageKeypad.keyStages} />
);

export const TeachersTab = Template.bind({});
