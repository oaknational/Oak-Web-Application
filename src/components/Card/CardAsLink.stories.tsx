import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Heading, P } from "../Typography";
import Flex from "../Flex";
import Icon from "../Icon";

import Component from "./CardAsLink";

export default {
  title: "Cards/Card as Link",
  component: Component,
  argTypes: {
    background: {
      defaultValue: "grey2",
    },
    href: {
      defaultValue: "/",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return (
    <Component {...args}>
      <h2>Card title</h2>
      <p>
        You can put anything you like in here. The whole card area is a link.
      </p>
    </Component>
  );
};

export const CardAsLink = Template.bind({});

export const CardAsLinkIcon: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "300px" }}>
    <Component {...args}>
      <Flex
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Icon name={"ChevronRight"} size={80} />
        <Heading mt={0} mb={0} fontSize={24} tag={"h5"} color={"grey8"}>
          Classroom
        </Heading>
      </Flex>
    </Component>
  </div>
);

export const CardAsLinkIconText: ComponentStory<typeof Component> = (args) => (
  <div style={{ width: "300px" }}>
    <Component {...args}>
      <Flex
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Icon name={"ChevronRight"} size={80} />
        <Heading mt={0} mb={24} fontSize={24} tag={"h5"} color={"grey8"}>
          Classroom
        </Heading>
      </Flex>
      <P color={"grey6"} fontSize={16}>
        Short snappy description of what this card is about.
      </P>
    </Component>
  </div>
);
