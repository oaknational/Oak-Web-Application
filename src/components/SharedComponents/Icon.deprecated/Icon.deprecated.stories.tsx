import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { OakHeading } from "@oaknational/oak-components";

import Component from "./Icon.deprecated";

import { ICON_NAMES } from "@/image-data";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <>
    <OakHeading $font={"heading-5"} $mb={"space-between-m"} tag="h2">
      Icons
    </OakHeading>
    {ICON_NAMES.map((name) => {
      return <Component {...args} name={name} />;
    })}
  </>
);

export const Icon = {
  render: Template,

  args: {
    name: "bell",
    size: 48,
  },
};
