import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import { MenuProvider } from "../../context/Menu";

import Component from "./AppHeader";

export default {
  title: "Headers & Footers/App Header",
  decorators: [AnalyticsDecorator], 
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <MenuProvider>
  <Component {...args} />
  </MenuProvider>
);

export const AppHeader = Template.bind({});
AppHeader.args = {};
