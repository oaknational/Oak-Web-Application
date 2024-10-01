import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from "./LayoutLandingPagesHeader";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const LayoutLandingPagesHeader = Template.bind({});
LayoutLandingPagesHeader.args = {
  headerCta: {
    linkType: "anchor",
    anchor: "formBlock",
    label: "Form CTA",
  },
};
