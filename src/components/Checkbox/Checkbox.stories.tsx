import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Form/Checkbox",
  component: Component,
  argTypes: {
    labelText: {
      defaultValue: "Click me",
    },
    id: {
      defaultValue: "Click me",
    },
    checked: {
      defaultValue: true,
    },
    onChange: {
      action: "changed",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [value, setValue] = useState(true);
  return (
    <Component {...args} checked={value} onChange={() => setValue(!value)} />
  );
};

export const Checkbox = Template.bind({});
