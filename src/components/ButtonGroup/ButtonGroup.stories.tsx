import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ButtonAsLink from "../Button/ButtonAsLink";

import Component from "./ButtonGroup";

export default {
  title: "Buttons/Button Group",
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
