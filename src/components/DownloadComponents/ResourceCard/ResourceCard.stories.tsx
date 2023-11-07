import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Component from "./ResourceCard";

const meta: Meta<typeof Component> = {
  component: Component,
  title: "Download Components/DL Card",
  argTypes: {
    id: {
      defaultValue: "1",
    },
    checked: {
      defaultValue: false,
    },
    onChange: {
      action: "changed",
    },
    resourceType: {
      defaultValue: "presentation",
    },
    hasError: {
      defaultValue: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Component>;

export const DLCard: Story = {
  args: {
    extension: "pdf",
    checked: false,
    onChange: action("changed"),
    resourceType: "worksheet-pdf",
    label: "Presentation",
    hasError: false,
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
