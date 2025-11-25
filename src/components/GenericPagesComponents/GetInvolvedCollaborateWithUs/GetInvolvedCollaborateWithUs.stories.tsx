import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { GetInvolvedCollaborateWithUs as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/GetInvolvedCollaborateWithUs",
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
    heading: "Collaborate with us",
    imageUrl:
      "https://res.cloudinary.com/oak-web-application/image/upload/v1763393163/icons/chatting-illustration_l52zaf.svg",
    imageAlt: "Two people having a conversation",
    cards: [
      {
        headingTag: "h3",
        headingTitle: "Give your feedback",
        content:
          "Share your story and we'll send you a gift voucher as a thanks for your time. Whether you've planned more efficiently, strengthened your subject knowledge or refreshed your curriculum design, your experience can inspire other teachers.",
        buttonText: "Get in touch",
        buttonLink: "https://share.hsforms.com/2pi1ZLqVKQNyKznqJrpqsgwbvumd",
      },
      {
        headingTag: "h3",
        headingTitle: "Help us improve",
        content:
          "Teachers are at the heart of everything we build. Have your say by taking part in research or road-testing new resources in your school.",
        buttonText: "Take part in research",
        buttonLink: "https://share.hsforms.com/1dv2FiLvTQraZIZmhUUURmQbvumd",
      },
    ],
  },
  render: (args) => <Component {...args} />,
};
