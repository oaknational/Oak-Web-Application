import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { CurricTermCard as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {
    title: {
      defaultValue: "Year 1",
    },
    coveredNumberOfLessons: {
      type: "number",
      defaultValue: 25,
    },
    totalNumberOfLessons: {
      type: "number",
      defaultValue: 30,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    title: "Year 1",
    coveredNumberOfLessons: 25,
    totalNumberOfLessons: 30,
    children: "<<CONTENT>>",
  },
  render: (args) => <Component {...args} />,
};
