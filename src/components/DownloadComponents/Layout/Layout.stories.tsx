import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import Component from "./Layout";

const meta: Meta<typeof Component> = {
  title: "Download Components/Layout",
  component: Component,
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Layout: Story = {
  args: {
    header: "Lesson resources",
    cardGroup: <div>Mock Card Group</div>,
    ctaButton: <button>CTA</button>,
    userDetails: <div>Mock user details</div>,
  },
  render: (args) => {
    return <Component {...args} />;
  },
};
