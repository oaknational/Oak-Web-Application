import React from "react";
import { StoryObj, StoryFn, Meta } from "@storybook/nextjs";
import { OakP, OakFlex } from "@oaknational/oak-components";

import Component from ".";

import CardTitle from "@/components/SharedComponents/Card/CardComponents/CardTitle";
import CardImage from "@/components/SharedComponents/Card/CardComponents/CardImage";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

export default {
  component: Component,
  argTypes: {
    background: {
      defaultValue: "grey20",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return (
    <Component {...args}>
      <h2>Card title</h2>
      <p>You can put anything you like in here.</p>
    </Component>
  );
};

export const Card = {
  render: Template,
};

export const CardIconButton: StoryObj<typeof Component> = {
  render: (args) => (
    <div style={{ width: "300px", height: "250px" }}>
      <Component {...args}>
        <CardTitle
          icon={"download"}
          $iconPosition={"leading"}
          iconSize={"all-spacing-7"}
          tag={"h4"}
        >
          Title
        </CardTitle>
        <OakP $font={"body-2"} $mb={"space-between-m"} $color={"grey50"}>
          Short snappy description of what this card is about.
        </OakP>
        <ButtonAsLink $mt={"auto"} label={"Label"} $fullWidth page="home" />
      </Component>
    </div>
  ),
};

export const CardImageButton: StoryObj<typeof Component> = {
  render: (args) => (
    <div style={{ width: "300px" }}>
      <Component {...args}>
        <CardImage illustration="magic-carpet" />
        <OakFlex $pa="inner-padding-xl" $flexDirection={"column"}>
          <CardTitle tag={"h4"}>Title</CardTitle>
          <OakP $font={"body-2"} $mb={"space-between-m"} $color={"grey50"}>
            Short snappy description of what this card is about.
          </OakP>
          <ButtonAsLink
            $mt={"auto"}
            $mb={16}
            label={"Label"}
            $fullWidth
            page={"home"}
          />
        </OakFlex>
      </Component>
    </div>
  ),

  args: {
    pa: 0,
  },
};

export const CardLargeIconCentered: StoryObj<typeof Component> = {
  render: (args) => (
    <div style={{ width: "300px", height: "336px" }}>
      <Component {...args}>
        <CardTitle
          icon={"download"}
          $iconPosition={"aboveTitle"}
          iconSize={"all-spacing-13"}
          tag={"h4"}
        >
          Title
        </CardTitle>
        <OakP
          $textAlign="center"
          $font={"body-2"}
          $mb={"space-between-m"}
          $color={"grey50"}
        >
          Short snappy description of what this card is about.
        </OakP>
        <ButtonAsLink
          $mb={16}
          $mt={"auto"}
          label={"Label"}
          $fullWidth
          page={"home"}
        />
      </Component>
    </div>
  ),
};
