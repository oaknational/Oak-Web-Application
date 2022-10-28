import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AuthProvider } from "../../context/Auth";
import { MenuProvider } from "../../context/Menu";
import AnalyticsDecorator from "../../decorators/AnalyticsDecorator";
import ToastDecorator from "../../decorators/ToastDecorator";

import Component from "./SiteHeader";

export default {
  title: "Headers & Footers/Site Header",
  decorators: [AnalyticsDecorator, ToastDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <AuthProvider>
    <MenuProvider>
      <Component {...args} />
    </MenuProvider>
  </AuthProvider>
);

export const SiteHeader = Template.bind({});
SiteHeader.args = {};
