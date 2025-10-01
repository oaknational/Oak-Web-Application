import { StoryFn, Meta } from "@storybook/nextjs";
import { ChangeEvent, useState } from "react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    placeholder: {
      defaultValue: "Placeholder",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  const [value, setValue] = useState("");
  return (
    <Component
      {...args}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  );
};

export const Input = {
  render: Template,
};

export const WithIcon = {
  render: Template,
  args: { icon: "search" },
};

export const WithLabel = {
  render: Template,
  args: { label: "Password" },
};

export const WithError = {
  render: Template,
  args: { error: "Password should contain at least 8 characters" },
};
