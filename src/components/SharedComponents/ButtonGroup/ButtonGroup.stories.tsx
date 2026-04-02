import React from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./ButtonGroup";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
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

export const ButtonGroup = {
  render: Template,
};
