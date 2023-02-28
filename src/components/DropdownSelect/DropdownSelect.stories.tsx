import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import Component from ".";

export default {
  title: "Form Fields/Dropdown",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [, setSelected] = useState<string>();
  return (
    <Component
      {...args}
      onChange={(e) => setSelected("value" in e.target ? e.target.value : "")}
    />
  );
};

export const DropdownSelect = Template.bind({});

DropdownSelect.args = {
  listItems: [
    { value: "1", label: "Teacher" },
    { value: "2", label: "Parent" },
    { value: "3", label: "Pupil" },
    { value: "4", label: "Other" },
  ],
  name: "Role select dropdown",
  placeholder: "What describes you best?",
  label: "User type",
};

export const DropdownSelectIcon = Template.bind({});

DropdownSelectIcon.args = {
  listItems: [
    { value: "1", label: "Teacher" },
    { value: "2", label: "Parent" },
    { value: "3", label: "Pupil" },
    { value: "4", label: "Other" },
  ],
  name: "Role select dropdown",
  placeholder: "What describes you best?",
  icon: "chevron-down",
};

export const DropdownSelectLabel = Template.bind({});

DropdownSelectLabel.args = {
  listItems: [
    { value: "1", label: "Teacher" },
    { value: "2", label: "Parent" },
    { value: "3", label: "Pupil" },
    { value: "4", label: "Other" },
  ],
  name: "Role select dropdown",
  label: "What describes you best?",
};
