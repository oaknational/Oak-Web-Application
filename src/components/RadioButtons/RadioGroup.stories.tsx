import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./RadioGroup";
import Radio from "./Radio";

export default {
  title: "Form Fields/Radio Group",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [selected, setSelected] = useState("");
  return (
    <Component value={selected} onChange={setSelected} {...args}>
      <Radio value="home">Home schooled</Radio>
      <Radio value="notListed">My school isn't listed</Radio>
    </Component>
  );
};

export const RadioGroup = Template.bind({});

export const RadioGroupError = Template.bind({});

RadioGroupError.args = {
  hasError: true,
  errorMessage: "Please select/search a school or an option from above",
};
