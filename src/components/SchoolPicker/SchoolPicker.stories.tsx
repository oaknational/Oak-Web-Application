import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import Box from "../Box";

import Component from "./SchoolPicker";

const items = [
  {
    urn: "101105",
    la: "Westminster",
    name: "Bricks Nursery School",
    postcode: "AB1 2CD",
  },
  {
    urn: "101188",
    la: "Barking and Dagenham",
    name: "Woodland Infants' School",
    postcode: "AB1 2CD",
  },
  {
    urn: "108776",
    la: "Sunderland",
    name: "Meadows Primary School",
    postcode: "AB1 2CD",
  },
  {
    urn: "114580",
    la: "Brighton and Hove",
    name: "Fields School",
    postcode: "AB1 2CD",
  },
  {
    urn: "138156",
    la: "Leicestershire",
    name: "Hillside School",
    postcode: "AB1 2CD",
  },
  {
    urn: "140687",
    la: "Barking and Dagenham",
    name: "New Junior Academy",
    postcode: "AB1 2CD",
  },
];

export default {
  title: "Form Fields/School Picker",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [schoolPickerInputValue, setSchoolPickerInputValue] = useState("");

  return (
    <Box $width={400} $height={400}>
      <Component
        {...args}
        label={"School picker"}
        schoolPickerInputValue={schoolPickerInputValue}
        setSchoolPickerInputValue={setSchoolPickerInputValue}
        schools={items}
        defaultSchools={items}
        setSelectedSchool={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Box>
  );
};

export const SchoolPicker = Template.bind({});

SchoolPicker.args = {
  hasError: false,
};

export const SchoolPickerError = Template.bind({});

SchoolPickerError.args = {
  hasError: true,
  required: true,
};
