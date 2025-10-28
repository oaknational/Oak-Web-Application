import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { Meta, StoryObj } from "@storybook/nextjs";

import { CurricLessonItem as Component } from ".";

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
    number: 1,
    title: "Scotland, England and Robert the Bruce",
    href: "#",
  },
  render: function Render(args) {
    return <Component {...args} />;
  },
};
