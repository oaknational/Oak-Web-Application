import { StoryFn, Meta } from "@storybook/nextjs";
import { useState } from "react";

import Component from ".";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  const [, setSelected] = useState<string>();
  return (
    <Component
      {...args}
      onChange={(e) => setSelected("value" in e.target ? e.target.value : "")}
    />
  );
};

export const DropdownSelect = {
  render: Template,

  args: {
    listItems: [
      { value: "1", label: "Teacher" },
      { value: "2", label: "Parent" },
      { value: "3", label: "Pupil" },
      { value: "4", label: "Other" },
    ],
    name: "Role select dropdown",
    placeholder: "What describes you best?",
    label: "User type",
  },
};

export const DropdownSelectIcon = {
  render: Template,

  args: {
    listItems: [
      { value: "1", label: "Teacher" },
      { value: "2", label: "Parent" },
      { value: "3", label: "Pupil" },
      { value: "4", label: "Other" },
    ],
    name: "Role select dropdown",
    placeholder: "What describes you best?",
    icon: "chevron-down",
  },
};

export const DropdownSelectLabel = {
  render: Template,

  args: {
    listItems: [
      { value: "1", label: "Teacher" },
      { value: "2", label: "Parent" },
      { value: "3", label: "Pupil" },
      { value: "4", label: "Other" },
    ],
    name: "Role select dropdown",
    label: "What describes you best?",
  },
};
