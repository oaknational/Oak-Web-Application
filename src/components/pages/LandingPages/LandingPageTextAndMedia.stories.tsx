import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Flex from "../../Flex";
import { mockImageAsset } from "../../../__tests__/__helpers__/cms";

import { LandingPageTextAndMedia as Component } from "./LandingPageTextAndMedia";

export default {
  title: "Sanity/Pages/Landing Pages",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Flex
    $pa={32}
    $background={"teachersLilac"}
    $justifyContent={"center"}
    $width="100%"
  >
    <Component {...args} />
  </Flex>
);

export const LandingPagesTextAndMedia = Template.bind({});
LandingPagesTextAndMedia.args = {
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
};
