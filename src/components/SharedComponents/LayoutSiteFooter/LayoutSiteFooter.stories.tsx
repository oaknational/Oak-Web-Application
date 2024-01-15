import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./LayoutSiteFooter";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";


export default {
  decorators: [CookieConsentDecorator, AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div style={{ background: "lightGrey", padding: "100px" }}>
    <Component {...args} />
  </div>
);

export const LayoutSiteFooter = Template.bind({});
