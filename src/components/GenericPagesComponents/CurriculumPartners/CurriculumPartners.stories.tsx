import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurriculumPartners as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/CurriculumPartners",
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
    title: "Current",
    text: "Partners involved in the creation of our new curricula (published after September 2022).",
    items: new Array(10).fill(true).map((_, index) => {
      return {
        imageUrl: `/images/oak-national-academy-logo-512.png#${index}`,
        alt: `item ${index}`,
      };
    }),
  },
  render: (args) => <Component {...args} />,
};
