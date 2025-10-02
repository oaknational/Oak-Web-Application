import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "storybook/preview-api";

import Component from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {
    onChange: {
      action: "onChange",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const AcceptTerms: Story = {
  args: {
    value: true,
    error: undefined,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Component {...args} onChange={(value) => updateArgs({ value })} />
      </OakThemeProvider>
    );
  },
};
