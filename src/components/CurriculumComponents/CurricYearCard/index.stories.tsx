import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/react";

import { CurricYearCard as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const CurricYearCard: Story = {
  args: {
    yearTitle: "Year 10",
    yearSubheading: "Literature",
    isExamboard: false,
  },
  render: function Render(args) {
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args}>
          <div>content goes here...</div>
        </Component>
      </OakThemeProvider>
    );
  },
};
