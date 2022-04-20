import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { AuthProvider } from "../../auth/useAuth";
import { SearchProvider } from "../../context/SearchContext";

import SiteHeader from "./SiteHeader";

export default {
  title: "Components/SiteHeader",
  component: SiteHeader,
  argTypes: {},
} as ComponentMeta<typeof SiteHeader>;

const Template: ComponentStory<typeof SiteHeader> = (args) => (
  <div>
    <AuthProvider>
      <SearchProvider>
        <SiteHeader {...args} />
      </SearchProvider>
    </AuthProvider>
  </div>
);

export const SiteFooterExample = Template.bind({});

SiteFooterExample.args = {};
