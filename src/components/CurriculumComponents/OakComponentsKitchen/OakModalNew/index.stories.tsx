import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";
import { useArgs } from "storybook/preview-api";

import { OakModalNew as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const OakModalNew: Story = {
  args: {
    open: false,
    title: <div>title</div>,
    content: <div>content</div>,
    footer: <div>footer</div>,
  },
  render: function Render(args) {
    const [, setArgs] = useArgs();
    return (
      <OakThemeProvider theme={oakDefaultTheme}>
        <button onClick={() => setArgs({ open: !args.open })}>
          open modal
        </button>
        <Component {...args} onClose={() => setArgs({ open: !args.open })} />
      </OakThemeProvider>
    );
  },
};
