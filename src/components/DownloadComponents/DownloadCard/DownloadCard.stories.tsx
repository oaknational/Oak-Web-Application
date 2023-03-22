import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  title: "Download Components/Download Card",
  component: Component,
  argTypes: {
    title: {
      defaultValue: "Click me",
    },
    id: {
      defaultValue: "1",
    },
    checked: {
      defaultValue: false,
    },
    onChange: {
      action: "changed",
    },
    resourceType: {
      defaultValue: "presentation",
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
