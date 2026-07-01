import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { SupportYou as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/SupportYou",
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
    title: "Discover how Oak can support you",
    body: "To explore the impact Oak’s curricula could have in your school or trust, fill out the form below and one of our experts will be in touch shortly.",
    link: {
      href: "#",
      text: "Get in touch with an expert",
    },
    image: {
      asset: {
        _id: "ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001-jpg",
        url: "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001.jpg",
      },
      altText: "",
    },
  },
  render: (args) => <Component {...args} />,
};
