import type { Meta, StoryObj } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import { LandingPageTextAndMedia as Component } from "./LandingPageTextAndMedia";

import { mockImageAsset } from "@/__tests__/__helpers__/cms";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const LandingPagesTextAndMedia: Story = {
  args: {
    title: "title",
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
    alignMedia: "left",
    mediaType: "image",
    image: mockImageAsset(),
  },
  render: (args) => (
    <OakFlex
      $pa="inner-padding-xl"
      $background={"lavender50"}
      $justifyContent={"center"}
      $width="100%"
    >
      <Component {...args} />
    </OakFlex>
  ),
};
