import { ComponentStory, ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { SelectedKey } from "./DropDownSelect";

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

export const DropDownSelect = Template.bind({});

DropDownSelect.parameters = {
  storyshots: { disable: true },
};

DropDownSelect.args = {
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

export const DropDownSelectIcon = Template.bind({});

DropDownSelectIcon.parameters = {
  storyshots: { disable: true },
};

DropDownSelectIcon.args = {
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

export const DropDownSelectLabel = Template.bind({});

DropDownSelectLabel.parameters = {
  storyshots: { disable: true },
};

DropDownSelectLabel.args = {
  listItems: [
    { id: 1, item: "Teacher" },
    { id: 2, item: "Parent" },
    { id: 3, item: "Pupil" },
    { id: 4, item: "Other" },
  ],
  name: "Role select dropdown",
  label: "What describes you best?",
};
