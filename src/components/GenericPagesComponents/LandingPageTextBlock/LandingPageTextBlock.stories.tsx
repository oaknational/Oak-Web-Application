import { Meta } from "@storybook/react";

import { LandingPageTextBlock as Component } from "./LandingPageTextBlock";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const LandingPagesTextBlock = {
  args: {
    bodyPortableText: [
      {
        _key: "fba015024518",
        _type: "block",
        children: [
          {
            _key: "e55d6209321d0",
            _type: "span",
            marks: [],
            text: "Our interim board oversees all of Oak’s work. They provide strategic direction, enable us to deliver on our plans, scrutinise our work and safeguard our independence. The interim board will be in place whilst a permanent board is chosen through a public appointments process.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
};
