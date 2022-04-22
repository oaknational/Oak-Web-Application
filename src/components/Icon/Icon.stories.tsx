import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Icon, { ICON_NAMES } from "./Icon";

export default {
  title: "Components/Icon",
  component: Icon,
  argTypes: {},
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => (
  <div>
    <h1>Icon Example</h1>
    <Icon {...args}></Icon>
    <h2>Available Icons</h2>
    {ICON_NAMES.map((icon, index) => (
      <Icon key={index} name={icon} />
    ))}
  </div>
);

export const IconExample = Template.bind({});

IconExample.args = {
  name: "ChevronRight",
  size: 100,
};
