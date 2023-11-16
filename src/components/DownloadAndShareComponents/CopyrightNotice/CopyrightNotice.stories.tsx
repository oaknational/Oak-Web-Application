import React from "react";
import { ComponentStory } from "@storybook/react";

import Component from ".";

export default {
  title: "Download components / Copyright Notice",
  component: Component,
  argTypes: {
    showPostAlbCopyright: { control: "radio", options: [true, false] },
  },
};

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const CopyrightNotice = Template.bind({});
