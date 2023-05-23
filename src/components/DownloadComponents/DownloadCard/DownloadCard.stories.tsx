import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import React from "react";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Download Components/Download Card",
  component: Component,
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
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Checkbox: Story = {
  args: {
    extension: "pdf",
    checked: false,
    onChange: action("changed"),
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
