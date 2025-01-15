import { Meta } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import Component from "./LayoutLandingPagesHeader";

export default {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
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
