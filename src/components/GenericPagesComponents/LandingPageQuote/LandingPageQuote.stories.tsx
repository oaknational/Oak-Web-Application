import { Meta } from "@storybook/nextjs";

import { LandingPageQuote as Component } from "./LandingPageQuote";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const LandingPagesQuote = {
  args: {
    text: "This is an inspiring quote",
    attribution: "I Wroteit",
  },
};
