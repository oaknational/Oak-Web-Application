import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./RadioGroup";
import Radio from "./Radio";

export default {
  title: "Form Fields/Radio Group",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  const [selected, setSelected] = useState("");
  return (
    <Component value={selected} onChange={setSelected}>
      <Radio value="home">Home schooled</Radio>
      <Radio value="notListed">My school isn't listed</Radio>
    </Component>
  );
};

export const RadioGroup = Template.bind({});
