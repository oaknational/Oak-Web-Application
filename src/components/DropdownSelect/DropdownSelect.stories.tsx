import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { SelectedKey } from "./DropdownSelect";

import Component from ".";

export default {
  title: "Form/Dropdown",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  const [, setSelectedKey] = useState<SelectedKey>("");
  return <Component {...args} onChange={setSelectedKey} />;
};

export const DropdownSelect = Template.bind({});

DropdownSelect.args = {
  listItems: [
    { id: 1, item: "Teacher" },
    { id: 2, item: "Parent" },
    { id: 3, item: "Pupil" },
    { id: 4, item: "Other" },
  ],
  name: "Role select dropdown",
  placeholder: "What describes you best?",
  label: "Role select dropdown",
};

export const DropdownSelectIcon = Template.bind({});

DropdownSelectIcon.args = {
  listItems: [
    { id: 1, item: "Teacher" },
    { id: 2, item: "Parent" },
    { id: 3, item: "Pupil" },
    { id: 4, item: "Other" },
  ],
  name: "Role select dropdown",
  placeholder: "What describes you best?",
  icon: "Newspaper",
};

export const DropdownSelectLabel = Template.bind({});

DropdownSelectLabel.args = {
  listItems: [
    { id: 1, item: "Teacher" },
    { id: 2, item: "Parent" },
    { id: 3, item: "Pupil" },
    { id: 4, item: "Other" },
  ],
  name: "Role select dropdown",
  label: "What describes you best?",
};
