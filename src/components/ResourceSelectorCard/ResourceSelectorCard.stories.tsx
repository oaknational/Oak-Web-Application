import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./ResourceSelectorCard";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  title: "HomePage/ResourceSelector",
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  //   <div style={{ background: "lightGrey", padding: "100px" }}>
  <Component
    {...args}
    icon={"worksheet"}
    title="Worksheets"
    angle={2}
    $top={96}
  />
  //   </div>
);

export const TeachersTab = Template.bind({});
