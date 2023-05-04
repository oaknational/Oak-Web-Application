import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./LandingPagesHeader";

export default {
  title: "Headers & Footers",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const LandingPagesHeader = Template.bind({});
LandingPagesHeader.args = {
  headerCta: {
    linkType: "anchor",
    anchor: "formBlock",
    label: "Form CTA",
  },
};
