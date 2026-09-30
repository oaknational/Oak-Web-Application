import type { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "storybook/preview-api";
import { expect, fn, userEvent, within } from "storybook/test";
import { OakBox } from "@oaknational/oak-components";

import { MultiSelect, type MultiSelectProps } from "./MultiSelect";

const meta = {
  component: MultiSelect,
  parameters: { layout: "padded" },
  args: {
    placeholder: "Choose resources",
    groups: [
      {
        value: "planning",
        label: "Planning",
        tagBackground: "bg-decorative4-main",
        options: [
          { value: "guidance", label: "Guidance" },
          { value: "examples", label: "Examples" },
        ],
      },
      {
        value: "teaching",
        label: "Teaching",
        tagBackground: "bg-decorative3-main",
        options: [
          { value: "lessons", label: "Lessons" },
          { value: "worksheets", label: "Worksheets", disabled: true },
        ],
      },
    ],
    selectedValues: [],
    onChange: fn(),
    onMobileConfirm: fn(),
    onMobileClose: fn(),
  },
  render: function Render(args) {
    const [{ selectedValues }, updateArgs] = useArgs<MultiSelectProps>();
    return (
      <OakBox $width="100%" $maxWidth="spacing-480">
        <MultiSelect
          {...args}
          selectedValues={selectedValues}
          onChange={(values) => {
            updateArgs({ selectedValues: values });
            args.onChange(values);
          }}
        />
      </OakBox>
    );
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selection: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.queryByRole("button", { name: "Choose resources" });
    if (trigger) await userEvent.click(trigger);
    const option = canvas.getByRole("checkbox", { name: "Guidance" });
    await userEvent.click(option);
    await expect(option).toBeChecked();
    await expect(
      canvas.getByRole("checkbox", { name: "Worksheets" }),
    ).toBeDisabled();
    await userEvent.click(option);
    await expect(option).not.toBeChecked();
    if (trigger) {
      await userEvent.keyboard("{Escape}");
      await expect(trigger).toHaveFocus();
    }
  },
};
export const WithSelections: Story = {
  args: { selectedValues: ["guidance", "lessons"] },
};
export const Disabled: Story = {
  args: { disabled: true, selectedValues: ["guidance"] },
};
export const Large: Story = { args: { size: "large" } };
export const OpensUpwards: Story = {
  args: { dropdownDirection: "up" },
  decorators: [
    (Story) => (
      <OakBox $pt="spacing-480">
        <Story />
      </OakBox>
    ),
  ],
};
