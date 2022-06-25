import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { P } from "../Typography";
import ButtonAsLink from "../Button/ButtonAsLink";
import image from "../../../public/images/Image.png";
import Flex from "../Flex";

import CardTitle from "./CardComponents/CardTitle";
import CardImage from "./CardComponents/CardImage";

import Component from ".";

export default {
  title: "Cards/Card",
  component: Component,
  argTypes: {
    background: {
      defaultValue: "grey1",
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
        icon={"Home"}
        iconPosition={"leading"}
        iconSize={34}
        title={"Title"}
        tag={"h4"}
      />
      <P fontSize={16} mb={24} color={"grey6"}>
        Short snappy description of what this card is about.
      </P>
      <ButtonAsLink
        mt={"auto"}
        label={"Lable"}
        fullWidth
        href={"/"}
      ></ButtonAsLink>
    </Component>
  </div>
);

export const CardImageButton: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "300px", height: "400px" }}>
    <Component {...args}>
      <CardImage imageSrc={"/" + image}></CardImage>
      <Flex pa={24} flexDirection={"column"}>
        <CardTitle title={"Title"} tag={"h4"} />
        <P fontSize={16} mb={24} color={"grey6"}>
          Short snappy description of what this card is about.
        </P>
        <ButtonAsLink
          mt={"auto"}
          mb={16}
          label={"Label"}
          fullWidth
          href={"/"}
        ></ButtonAsLink>
      </Flex>
    </Component>
  </div>
);
CardImageButton.args = {
  pa: 0,
};

export const CardLargeIconCentered: ComponentStory<typeof Component> = (
  args
) => (
  <div style={{ width: "300px", height: "336px" }}>
    <Component {...args}>
      <CardTitle
        icon={"Home"}
        iconPosition={"aboveTitle"}
        iconSize={90}
        title={"Title"}
        tag={"h4"}
        textCenter
      />
      <P textAlign="center" fontSize={16} mb={24} color={"grey6"}>
        Short snappy description of what this card is about.
      </P>
      <ButtonAsLink
        mb={16}
        mt={"auto"}
        label={"Label"}
        fullWidth
        href={"/"}
      ></ButtonAsLink>
    </Component>
  </div>
);
