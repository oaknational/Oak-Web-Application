import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";
import { OakFlex } from "@oaknational/oak-components";

import Component from "./LandingPageHero";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <OakFlex $background={"lavender50"} $justifyContent={"center"} $width="100%">
    <Component {...args} />
  </OakFlex>
);

export const LandingPagesHero = {
  render: Template,

  args: {
    hero: {
      title: "some-landing-page title",
      heading: "landing page heading",
    },
  },
};

export const LandingPagesHeroImageCta = {
  render: Template,

  args: {
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
  },
};
