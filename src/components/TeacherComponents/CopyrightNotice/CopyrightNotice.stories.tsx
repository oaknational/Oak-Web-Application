import React from "react";
import { StoryFn } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    showPostAlbCopyright: { control: "radio", options: [true, false] },
  },
};

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const CopyrightNotice = Template.bind({});
