import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AnalyticsDecorator from "../../storybook-decorators/AnalyticsDecorator";
import CookieConsentDecorator from "../../storybook-decorators/CookieConsentDecorator";

import Component from "./SiteFooter";

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

export const SiteFooter = Template.bind({});
