import React from "react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./Button";

export default {
  component: Component,
  argTypes: {
    onClick: { action: "clicked" },
    label: {
      defaultValue: "download",
    },
    variant: {
      defaultValue: "brush",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => (
  <OakThemeProvider theme={oakDefaultTheme}>
    <Component background="black" $mr={24} {...args} />
    <Component background="blue" $mr={24} {...args} />
    <Component background="oakGreen" $mr={24} {...args} />
  </OakThemeProvider>
);

export const Button = {
  render: Template,
};

export const ButtonWithIcon = {
  render: Template,

  args: {
    icon: "save",
    size: "large",
  },
};

export const ButtonWithSubject = {
  render: Template,
  args: {
    size: "large",
    subjectIcon: "biology",
  },
};

const MinimalButtonWithIconTemplate: StoryFn<typeof Component> = (args) => (
  <OakThemeProvider theme={oakDefaultTheme}>
    <Component iconBackground="black" $mr={24} {...args} />
    <Component iconBackground="blue" $mr={24} {...args} />
    <Component iconBackground="oakGreen" $mr={24} {...args} />
  </OakThemeProvider>
);

export const MinimalButtonWithIcon = {
  render: MinimalButtonWithIconTemplate,

  args: {
    variant: "minimal",
    icon: "save",
    size: "large",
  },
};
