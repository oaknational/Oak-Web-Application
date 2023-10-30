import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./DownloadButton";

export default {
  title: "Buttons/Download",
  component: Component,
  args: {
    isLoading: false,
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Button = Template.bind({});
