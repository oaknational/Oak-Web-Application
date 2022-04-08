import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SiteHeader from "./SiteHeader";

export default {
  title: "Components/SiteHeader",
  component: SiteHeader,
  argTypes: {},
} as ComponentMeta<typeof SiteHeader>;

const Template: ComponentStory<typeof SiteHeader> = (args) => (
  <div>
    <SiteHeader {...args} />
  </div>
);

export const SiteFooterExample = Template.bind({});

SiteFooterExample.args = {};
