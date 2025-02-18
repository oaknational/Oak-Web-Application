import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    label: {
      defaultValue: "Click me",
    },
    id: {
      defaultValue: "1",
    },
    name: {
      defaultValue: "checkbox-group",
    },
    checked: {
      defaultValue: false,
    },
    onChange: {
      action: "changed",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  const [value, setValue] = useState(false);
  return (
    <Component {...args} checked={value} onChange={() => setValue(!value)} />
  );
};

export const Checkbox = {
  render: Template,
};
