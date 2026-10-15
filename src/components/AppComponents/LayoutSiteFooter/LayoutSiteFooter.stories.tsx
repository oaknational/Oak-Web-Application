import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import { LayoutSiteFooterInner } from "./LayoutSiteFooter";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import CookieConsentDecorator from "@/storybook-decorators/CookieConsentDecorator";
import TeacherBrowseAnalyticsDecorator from "@/storybook-decorators/TeacherBrowseAnalyticsDecorator";

export default {
  decorators: [
    CookieConsentDecorator,
    AnalyticsDecorator,
    TeacherBrowseAnalyticsDecorator,
  ],
  component: LayoutSiteFooterInner,
  argTypes: {},
} as Meta<typeof LayoutSiteFooterInner>;

const Template: StoryFn<typeof LayoutSiteFooterInner> = (args) => (
  <div style={{ background: "lightGrey", padding: "100px" }}>
    <LayoutSiteFooterInner {...args} />
  </div>
);

export const LayoutSiteFooter = {
  render: Template,
};
