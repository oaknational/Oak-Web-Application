import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { Heading } from "../Typography";
import { ICON_NAMES } from "../../image-data";

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
  </>
);

export const Icon = Template.bind({});

Icon.args = {
  name: "bell",
  size: 48,
};
