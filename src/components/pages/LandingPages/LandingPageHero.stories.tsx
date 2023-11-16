import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Flex from "../../Flex";

import Component from "./LandingPageHero";

export default {
  title: "Sanity/Pages/Landing Pages",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Flex $background={"lavender50"} $justifyContent={"center"} $width="100%">
    <Component {...args} />
  </Flex>
);

export const LandingPagesHero = Template.bind({});
LandingPagesHero.args = {
  hero: {
    title: "some-landing-page title",
    heading: "landing page heading",
  },
};

export const LandingPagesHeroImageCta = Template.bind({});
LandingPagesHeroImageCta.args = {
  hero: {
    title: "some-landing-page title",
    heading: "landing page heading",
    cta: {
      linkType: "anchor",
      label: "cta",
      anchor: "formBlock",
    },
    image: {
      asset: {
        _id: `image-123-300x300-png`,
        url: `https://cdn.sanity.io/images/p/d/123-300x300.png`,
      },
    },
  },
};
