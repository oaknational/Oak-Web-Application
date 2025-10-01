import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./LayoutSiteFooter";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";

export default {
  decorators: [CookieConsentDecorator, AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <div style={{ background: "lightGrey", padding: "100px" }}>
    <Component {...args} />
  </div>
);

export const LayoutSiteFooter = {
  render: Template,
};
