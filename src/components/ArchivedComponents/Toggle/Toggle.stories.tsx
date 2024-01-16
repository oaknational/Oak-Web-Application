import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from ".";

export default {
  component: Component,
  argTypes: {
    labelOn: {
      defaultValue: "Label on",
    },
    labelOff: {
      defaultValue: "Label off",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [value, setValue] = useState(false);
  return (
    <div style={{ background: "lightBlue", padding: "100px" }}>
      <Component {...args} checked={value} onChange={() => setValue(!value)} />
    </div>
  );
};

export const Toggle = Template.bind({});

export const ToggleDisabled = Template.bind({});

ToggleDisabled.args = {
  disabled: true,
};
