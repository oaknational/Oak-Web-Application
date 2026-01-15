import { Meta, StoryObj } from "@storybook/nextjs";
import {
  OakBox,
  oakDefaultTheme,
  OakThemeProvider,
} from "@oaknational/oak-components";

import { MeetTheTeamContainer as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/MeetTheTeamContainer",
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
    title: "Our leadership",
    text: "Our leadership team brings together experts to deliver the best support to teachers and value for money for the public. Learn more about them below.",
    children: <OakBox $borderStyle={"solid"}>Content...</OakBox>,
  },
  render: (args) => <Component {...args} />,
};
