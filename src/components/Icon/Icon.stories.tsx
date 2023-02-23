import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Heading } from "../Typography";
import { GRAPHIC_NAMES, ICON_NAMES } from "../../image-data/types";

import Component from "./Icon";

export default {
  title: "Media/Icon",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <>
    <Heading $font={"heading-5"} $mb={24} tag="h2">
      Icons
    </Heading>
    {ICON_NAMES.map((name) => {
      return <Component {...args} name={name} />;
    })}

    <Heading $font={"heading-5"} $mv={24} tag="h2">
      Graphics
    </Heading>
    {GRAPHIC_NAMES.map((name) => {
      return <Component {...args} name={name} />;
    })}
  </>
);

export const Icon = Template.bind({});

Icon.args = {
  name: "bell",
  size: 48,
};
