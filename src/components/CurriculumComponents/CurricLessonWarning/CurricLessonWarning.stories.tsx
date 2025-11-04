import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricLessonWarning as Component } from "./";

const meta: Meta<typeof Component> = {
  component: Component,
  argTypes: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Component>;

export const BasicUsage: Story = {
  args: {
    count: 4,
    total: 6,
  },
  render: function Render(args) {
    return <Component {...args} />;
  },
};
