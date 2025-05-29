import { Meta, StoryObj } from "@storybook/react";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import Component from "./CurricModalErrorContent";

const meta: Meta<typeof Component> = {
  component: Component,
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

export const CurricModalErrorContent: Story = {
  args: {
    statusCode: "404",
    message: "Something went wrong",
    additional: "Close the modal to continue",
  },
  render: (args) => <Component {...args} />,
};
