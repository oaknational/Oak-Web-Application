import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { OakHeading } from "@oaknational/oak-components";

import Component from "./Icon";

import { ICON_NAMES } from "@/image-data";

export default {
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <>
    <OakHeading $font={"heading-5"} $mb={"space-between-m"} tag="h2">
      Icons
    </OakHeading>
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
