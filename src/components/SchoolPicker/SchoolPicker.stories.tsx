import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import Box from "../Box";

import Component from "./SchoolPicker";

const items = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Dorothy Gardner Nursery School",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Infants' School",
  },
  {
    urn: "108776",
    la: "Sunderland",
    name: "Dame Dorothy Primary School",
  },
  {
    urn: "114580",
    la: "Brighton and Hove",
    name: "Dorothy Stringer School",
  },
  {
    urn: "138156",
    la: "Leicestershire",
    name: "Dorothy Goodman School Hinckley",
  },
  {
    urn: "140687",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Junior Academy",
  },
];

export default {
  title: "Form Fields/School Picker",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = () => {
  const [inputValue, setInputValue] = useState("");
  return (
    <Box $width={400} $height={400}>
      <Component
        label={"School picker"}
        inputValue={inputValue}
        setInputValue={setInputValue}
        schools={items}
        defaultSchools={items}
      />
    </Box>
  );
};

export const SchoolPicker = Template.bind({});
