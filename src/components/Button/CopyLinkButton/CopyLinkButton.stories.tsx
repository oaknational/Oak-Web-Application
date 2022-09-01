import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./CopyLinkButton";

export default {
  title: "Buttons/Copy Link",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const CopyLinkButton = Template.bind({});
