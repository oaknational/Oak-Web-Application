import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ChangeEvent, useState } from "react";

import Component from ".";

export default {
  title: "Form/Input",
  component: Component,
  argTypes: {
    placeholder: {
      defaultValue: "Placeholder",
    },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [value, setValue] = useState("");
  return (
    <Component
      {...args}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  );
};

export const Input = Template.bind({});
export const WithIcon = Template.bind({});
WithIcon.args = { icon: "Search" };
