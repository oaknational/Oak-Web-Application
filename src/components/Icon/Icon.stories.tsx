import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Icon from "./Icon";

export default {
  title: "Media/Icon",
  component: Icon,
  argTypes: {},
} as ComponentMeta<typeof Icon>;

const Template: ComponentStory<typeof Icon> = (args) => (
  <div>
    <Icon {...args}></Icon>
  </div>
);

export const IconExample = Template.bind({});

IconExample.args = {
  name: "ChevronRight",
  size: 100,
};
