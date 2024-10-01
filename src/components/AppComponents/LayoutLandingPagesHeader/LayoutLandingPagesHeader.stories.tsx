import { Meta } from "@storybook/react";

import Component from "./LayoutLandingPagesHeader";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const LayoutLandingPagesHeader = {
  args: {
    headerCta: {
      linkType: "anchor",
      anchor: "formBlock",
      label: "Form CTA",
    },
  },
};
