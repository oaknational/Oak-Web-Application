import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { GetInvolvedLinkCard as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/GetInvolvedLinkCard",
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
    headingTag: "h2",
    headingTitle: "Give your feedback",
    buttons: [{ text: "Get in touch", link: "#" }],
    content:
      "Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers.",
  },
  render: (args) => <Component {...args} />,
};

export const WithMultipleButtons: Story = {
  args: {
    headingTag: "h2",
    headingTitle: "Help us improve",
    buttons: [
      { text: "Join the research panel", link: "#" },
      { text: "Explore our research", link: "#" },
    ],
    content:
      "Teachers are at the heart of everything we build. Have your say by taking part in research or road-testing new resources in your school.",
  },
  render: (args) => <Component {...args} />,
};
