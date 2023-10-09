import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MenuProvider } from "../../context/Menu";
import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import ToastDecorator from "../../storybook-decorators/ToastDecorator";

import Component from "./SiteHeader";

export default {
  title: "Headers & Footers/Site Header",
  decorators: [AnalyticsDecorator, ToastDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <MenuProvider>
    <Component {...args} />
  </MenuProvider>
);

export const SiteHeader = Template.bind({});
SiteHeader.args = {};
