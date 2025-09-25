import { Meta } from "@storybook/nextjs";

import { LandingPageSignupPrompt as Component } from "./LandingPageSignupPrompt";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  decorators: [AnalyticsDecorator],
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

export const LandingPageSignupPrompt = {
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
    title: "title",
    form: {
      title: "title of the form",
    },
  },
};
