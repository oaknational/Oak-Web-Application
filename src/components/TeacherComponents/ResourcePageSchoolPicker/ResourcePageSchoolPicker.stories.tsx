import { StoryFn, Meta } from "@storybook/react";
import { useState } from "react";

import Component from "./ResourcePageSchoolPicker";

import Box from "@/components/SharedComponents/Box";

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
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
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
        withHomeschool={true}
      />
    </Box>
  );
};

export const ResourcePageSchoolPicker = Template.bind({});

ResourcePageSchoolPicker.args = {
  hasError: false,
};

export const ResourcePageSchoolPickerError = Template.bind({});

ResourcePageSchoolPickerError.args = {
  hasError: true,
  required: true,
};
