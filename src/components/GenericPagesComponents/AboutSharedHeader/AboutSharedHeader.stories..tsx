import { Meta, StoryObj } from "@storybook/nextjs";

import { AboutSharedHeader as Component } from ".";

import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";


const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/AboutSharedHeader",
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
    title: "About Oak",
    content:
      "We're here to support and inspire teachers to deliver great teaching, so every pupil benefits",
    // imageUrl:
    //   "https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg",
    // imageAlt: "Oak logo",
  },
  render: (args) => <Component {...args} />,
};
