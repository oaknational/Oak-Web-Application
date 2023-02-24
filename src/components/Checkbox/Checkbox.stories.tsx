import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Form Fields/Checkbox",
  component: Component,
  argTypes: {
    labelText: {
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
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [value, setValue] = useState(false);
  return (
    <Component {...args} checked={value} onChange={() => setValue(!value)} />
  );
};

export const Checkbox = Template.bind({});
