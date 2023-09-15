import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./OldBetaHomeTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  title: "HomePage/OldBetaHomeTab",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} curriculumData={keyStageKeypad} />
);

export const OldBetaHomeTab = Template.bind({});
