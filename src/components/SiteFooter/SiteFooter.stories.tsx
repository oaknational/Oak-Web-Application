import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import footerSections from "../../browser-lib/fixtures/footerSectionLinks";
import ButtonAsLink from "../Button/ButtonAsLink";

import Component from "./SiteFooter";

export default {
  title: "Headers & Footers/Site Footer",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const SiteFooter = Template.bind({});
SiteFooter.args = {
  footerSections: footerSections,
};

export const SiteFooterWithNotifcation = Template.bind({});
SiteFooterWithNotifcation.args = {
  footerSections: footerSections,
  footerNotification: (
    <ButtonAsLink
      label={"Join new Oak"}
      icon={"Home"}
      aria-label={"Join new oak"}
      href={"/beta/onboarding"}
      variant="transparent"
    />
  ),
};
