import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AuthProvider } from "../../context/Auth";
import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./SiteHeader";

export default {
  title: "Headers & Footers/SiteHeader",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <div>
    <AuthProvider>
      <SearchProvider>
        <Component {...args} />
      </SearchProvider>
    </AuthProvider>
  </div>
);

export const SiteFooterExample = Template.bind({});

SiteFooterExample.args = {};
