import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import Box from "../Box";

import Component from "./SchoolPicker";

const items = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Dorothy Gardner Nursery School",
    postcode: "BN1 6NB",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Infants' School",
    postcode: "BN1 6NB",
  },
  {
    urn: "108776",
    la: "Sunderland",
    name: "Dame Dorothy Primary School",
    postcode: "BN1 6NB",
  },
  {
    urn: "114580",
    la: "Brighton and Hove",
    name: "Dorothy Stringer School",
    postcode: "BN1 6NB",
  },
  {
    urn: "138156",
    la: "Leicestershire",
    name: "Dorothy Goodman School Hinckley",
    postcode: "BN1 6NB",
  },
  {
    urn: "140687",
    la: "Barking and Dagenham",
    name: "Dorothy Barley Junior Academy",
    postcode: "BN1 6NB",
  },
];

export default {
  title: "Form Fields/School Picker",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Box $width={400} $height={400}>
      <Component
        {...args}
        label={"School picker"}
        inputValue={inputValue}
        setInputValue={setInputValue}
        schools={items}
        defaultSchools={items}
        setSelectedValue={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Box>
  );
};

export const SchoolPicker = Template.bind({});

SchoolPicker.args = {
  error: false,
};

export const SchoolPickerError = Template.bind({});

SchoolPickerError.args = {
  error: true,
  required: true,
};
