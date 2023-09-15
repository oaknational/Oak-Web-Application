import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./PupilTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  title: "HomePage/PupilTab",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const PupilTab = Template.bind({});
