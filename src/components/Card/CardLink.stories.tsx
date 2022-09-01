import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Heading, P } from "../Typography";
import { getPupilsUrl } from "../../common-lib/urls";

import Card from "./Card";
import Component from "./CardLink";

export default {
  title: "Cards/Card Link",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  return (
    <Card $background={"grey4"}>
      <Heading $mt={24} $mb={12} $fontSize={24} tag={"h5"} $color={"grey8"}>
        <Component href={getPupilsUrl()}>Card link</Component>
      </Heading>
      <P>
        Drop a CardLink component into a Card, pass in an href and the whole
        card becomes a link. The CardLink should be the child of a Heading to
        ensure the Heading is focusable
      </P>
    </Card>
  );
};

export const CardLink = Template.bind({});
