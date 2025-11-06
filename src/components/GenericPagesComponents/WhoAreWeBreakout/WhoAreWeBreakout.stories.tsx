import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { WhoAreWeBreakout as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/WhoAreWeBreakout",
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

export const Default: Story = {
  args: {
    cloudinaryId: "test",
    content:
      "We’re Oak, your trusted planning partner for great teaching. Our free, adaptable resources evolve with education to give teachers and schools the latest tools to deliver inspiring lessons, save time and improve pupil outcomes.",
  },
  render: (args) => <Component {...args} />,
};
