import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { P } from "../Typography";


import CardTitle from "./CardComponents/CardTitle";
import CardImage from "./CardComponents/CardImage";

import Component from ".";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";

export default {
  component: Component,
  argTypes: {
    background: {
      defaultValue: "grey20",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <Component {...args}>
      <h2>Card title</h2>
      <p>You can put anything you like in here.</p>
    </Component>
  );
};

export const Card = Template.bind({});

export const CardIconButton: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "300px", height: "250px" }}>
    <Component {...args}>
      <CardTitle
        icon={"download"}
        $iconPosition={"leading"}
        iconSize={32}
        tag={"h4"}
      >
        Title
      </CardTitle>
      <P $font={"body-2"} $mb={24} $color={"grey50"}>
        Short snappy description of what this card is about.
      </P>
      <ButtonAsLink $mt={"auto"} label={"Label"} $fullWidth page="home" />
    </Component>
  </div>
);

export const CardImageButton: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "300px" }}>
    <Component {...args}>
      <CardImage illustration="magic-carpet" />
      <Flex $pa={24} $flexDirection={"column"}>
        <CardTitle tag={"h4"}>Title</CardTitle>
        <P $font={"body-2"} $mb={24} $color={"grey50"}>
          Short snappy description of what this card is about.
        </P>
        <ButtonAsLink
          $mt={"auto"}
          $mb={16}
          label={"Label"}
          $fullWidth
          page={"home"}
        />
      </Flex>
    </Component>
  </div>
);
CardImageButton.args = {
  pa: 0,
};

export const CardLargeIconCentered: ComponentStory<typeof Component> = (
  args,
) => (
  <div style={{ width: "300px", height: "336px" }}>
    <Component {...args}>
      <CardTitle
        icon={"download"}
        $iconPosition={"aboveTitle"}
        iconSize={80}
        tag={"h4"}
      >
        Title
      </CardTitle>
      <P $textAlign="center" $font={"body-2"} $mb={24} $color={"grey50"}>
        Short snappy description of what this card is about.
      </P>
      <ButtonAsLink
        $mb={16}
        $mt={"auto"}
        label={"Label"}
        $fullWidth
        page={"home"}
      />
    </Component>
  </div>
);
