import { Meta, StoryObj } from "@storybook/react";

import Component from "./CurricUnitDetails";
import { basicUnit } from "./CurricUnitDetails.fixtures";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    unit: {
      defaultValue: basicUnit,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricUnitDetails: Story = {
  args: {
    unit: basicUnit,
  },
  render: (args) => <Component {...args} />,
};
