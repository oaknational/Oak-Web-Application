import { StoryFn, Meta } from "@storybook/react";
import { useState } from "react";
import { OakBox } from "@oaknational/oak-components";

import Component from "./ResourcePageSchoolPicker";

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
    <OakBox $width="all-spacing-20" $height="all-spacing-20">
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
    </OakBox>
  );
};

export const ResourcePageSchoolPicker = {
  render: Template,

  args: {
    hasError: false,
  },
};

export const ResourcePageSchoolPickerError = {
  render: Template,

  args: {
    hasError: true,
    required: true,
  },
};
