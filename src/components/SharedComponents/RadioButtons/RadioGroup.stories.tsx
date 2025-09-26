import React, { useState } from "react";
import { StoryFn, Meta } from "@storybook/nextjs";

import Component from "./RadioGroup";
import Radio from "./Radio";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  const [selected, setSelected] = useState("");
  return (
    <Component value={selected} onChange={setSelected} {...args}>
      <Radio value="home">Home schooled</Radio>
      <Radio value="notListed">My school isn't listed</Radio>
    </Component>
  );
};

export const RadioGroup = {
  render: Template,
};

export const RadioGroupError = {
  render: Template,

  args: {
    hasError: true,
    errorMessage: "Please select/search a school or an option from above",
  },
};
