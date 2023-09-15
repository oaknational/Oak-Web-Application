import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./CurriculumTab";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  title: "HomePage/CurriculumTab",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const CurriculumTab = Template.bind({});
