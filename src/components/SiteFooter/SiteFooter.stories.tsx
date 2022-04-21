import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SiteFooter from "./SiteFooter";

export default {
  title: "Components/SiteFooter",
  component: SiteFooter,
  argTypes: {},
} as ComponentMeta<typeof SiteFooter>;

const Template: ComponentStory<typeof SiteFooter> = (args) => (
  <div>
    <SiteFooter {...args} />
  </div>
);

export const SiteFooterExample = Template.bind({});

SiteFooterExample.args = {};
