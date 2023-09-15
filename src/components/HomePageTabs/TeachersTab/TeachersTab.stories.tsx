import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./TeachersTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  title: "HomePage/TeachersTab",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  //   <div style={{ background: "lightGrey", padding: "100px" }}>
  <Component {...args} keyStages={keyStageKeypad.keyStages} />
  //   </div>
);

export const TeachersTab = Template.bind({});
