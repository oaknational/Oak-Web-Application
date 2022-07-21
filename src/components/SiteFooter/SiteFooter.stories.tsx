import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Link from "next/link";

import footerSections from "../../browser-lib/fixtures/footerSectionLinks";
import IconButtonAsLink from "../Button/IconButtonAsLink";
import Flex from "../Flex";
import { Heading } from "../Typography";

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
    <Flex justifyContent={"center"} alignItems={"center"}>
      <IconButtonAsLink
        icon={"Rocket"}
        aria-label={"Join new beta oak"}
        href={"/beta/onboarding"}
        size={"tiny"}
        mr={12}
        variant={"primary"}
      />
      <Heading tag="h5" fontSize={16}>
        <Link href={"/beta/onboarding"}>Join Beta</Link>
      </Heading>
    </Flex>
  ),
};
