import React from "react";
import { Meta, StoryFn } from "@storybook/nextjs";

import BoxBorders, { BoxBordersProps } from "./BoxBorders";

export default {
  // title: 'SharedComponents/SpriteSheet/BrushSvgs/BoxBorders',
  component: BoxBorders,
  argTypes: {
    gapPosition: {
      control: {
        type: "select",
        options: ["bottomRight", "bottomRightCorner", "rightTop"],
      },
    },
    hideTop: { control: "boolean" },
    hideBottom: { control: "boolean" },
    hideRight: { control: "boolean" },
    hideLeft: { control: "boolean" },
    hideOnMobileH: { control: "boolean" },
    hideOnMobileV: { control: "boolean" },
  },
} as Meta;

const Template: StoryFn<BoxBordersProps> = (args) => <BoxBorders {...args} />;

export const Default = Template.bind({});
Default.args = {
  gapPosition: undefined,
  $zIndex: null,
  hideTop: false,
  hideBottom: false,
  hideRight: false,
  hideLeft: false,
  $color: "black",
  hideOnMobileH: false,
  hideOnMobileV: false,
};

export const WithGapPosition = Template.bind({});
WithGapPosition.args = {
  ...Default.args,
  gapPosition: "bottomRight",
};
