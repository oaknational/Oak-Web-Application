import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AuthProvider } from "../../context/Auth";
import { SearchProvider } from "../../context/Search/SearchContext";

import Component from "./AppHeader";

export default {
  title: "Headers & Footers/App Header",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <AuthProvider>
    <SearchProvider>
      <Component {...args} />
    </SearchProvider>
  </AuthProvider>
);

export const AppHeader = Template.bind({});
AppHeader.args = {};
