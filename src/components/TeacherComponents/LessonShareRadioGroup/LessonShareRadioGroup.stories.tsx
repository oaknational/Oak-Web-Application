import { Meta, StoryObj } from "@storybook/nextjs";
import { useForm } from "react-hook-form";

import { ResourceFormValues } from "../types/downloadAndShare.types";

import Component, { LessonShareRadioGroupProps } from "./LessonShareRadioGroup";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "656px" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <Wrapper {...args} />,
};

export default meta;

type Story = StoryObj<typeof Component>;

const Wrapper = (args: Omit<LessonShareRadioGroupProps, "control">) => {
  const { control } = useForm<ResourceFormValues>();

  return <Component {...args} control={control} />;
};

export const HideYearGroup: Story = {
  args: {
    name: "hideYearGroup",
    title: "Hide year group when sharing?",
    description:
      "Hiding the year group when sharing can help pupils of different ages, abilities, or contexts engage with the material without worrying whether it's for their year.",
    icon: "class-grouping",
    options: [
      { value: "show", label: "Show year group" },
      { value: "hide", label: "Hide year group" },
    ],
  },
};

export const HideYearGroupSelected: Story = {
  args: {
    ...HideYearGroup.args,
    defaultValue: "hide",
  },
};
