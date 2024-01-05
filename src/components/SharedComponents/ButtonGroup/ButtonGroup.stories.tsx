import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./ButtonGroup";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

export default {
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args}>
    <ButtonAsLink
      href="/"
      page={null}
      label="Download"
      aria-label="Download Lesson"
      icon="download"
    />
    <ButtonAsLink
      href="/"
      page={null}
      label="Share"
      aria-label="Share Lesson"
      icon="share"
    />
  </Component>
);

export const ButtonGroup = Template.bind({});
