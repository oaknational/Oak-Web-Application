import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import sections from "../../browser-lib/fixtures/footerSections";
import ButtonAsLink from "../Button/ButtonAsLink";

import Component from "./SiteFooter";

export default {
  title: "Headers & Footers/Site Footer",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div style={{ background: "lightGrey", padding: "100px" }}>
    <Component {...args} />
  </div>
);

export const SiteFooter = Template.bind({});
SiteFooter.args = {
  sections,
};

export const SiteFooterWithNotifcation = Template.bind({});
SiteFooterWithNotifcation.args = {
  sections,
  notification: (
    <ButtonAsLink
      label={"Join new Oak"}
      icon={"Download"}
      aria-label={"Join new oak"}
      href={"/beta/onboarding"}
      variant="minimal"
    />
  ),
};
