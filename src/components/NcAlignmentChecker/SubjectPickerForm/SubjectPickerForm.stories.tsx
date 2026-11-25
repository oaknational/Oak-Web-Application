import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "storybook/test";

import { basicSubjectPickerFormFixture } from "./SubjectPickerForm.fixtures";

import SubjectPickerForm from ".";

const meta = {
  component: SubjectPickerForm,
  title: "Components/NcAlignmentChecker/SubjectPickerForm",
  tags: ["autodocs"],
} satisfies Meta<typeof SubjectPickerForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...basicSubjectPickerFormFixture },
};

export const WithErrors: Story = {
  args: { ...basicSubjectPickerFormFixture },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole("button", { name: /Get started/i });
    await userEvent.click(submitButton);
  },
};

export const ShowsYearsForWhenMathsSelected: Story = {
  args: { ...basicSubjectPickerFormFixture },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mathsOption = canvas.getByRole("radio", { name: /Maths/i });
    await userEvent.click(mathsOption);
  },
};
