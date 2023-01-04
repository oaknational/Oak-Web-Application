import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./LandingPagesHeader";

export default {
  title: "Headers & Footers",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <SearchProvider>
    <Component {...args} />
  </SearchProvider>
);

export const LandingPagesHeader = Template.bind({});
LandingPagesHeader.args = {
  headerCta: {
    linkType: "anchor",
    anchor: "formBlock",
    label: "Form CTA",
  },
};
