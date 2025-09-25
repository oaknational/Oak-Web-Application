import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { ComponentProps } from "react";

import Component from ".";

import { createFilter } from "@/fixtures/curriculum/filters";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricUnitModal: Story = {
  args: {
    open: true,
    onClose: () => {},
    ks4OptionSlug: null,
    filters: createFilter({}),
  },
  render: function Render(args: ComponentProps<typeof Component>) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} />
      </OakThemeProvider>
    );
  },
};
