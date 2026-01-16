import { Meta, StoryObj } from "@storybook/nextjs";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import ProfileCard from "./";

const meta: Meta<typeof ProfileCard> = {
  component: ProfileCard,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/ProfileCard",
  argTypes: {},
  parameters: {},
  decorators: [
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProfileCard>;

export const Default: Story = {
  args: {
    name: "Ed Southall",
    role: "Subject Lead (maths)",
    href: "#",
    image:
      "https://cdn.sanity.io/images/cuvjke51/production/5a3b5c6b33c974b6ca030a5f7c531868ef8a4311-512x512.png",
  },
};

export const NoImage: Story = {
  args: {
    name: "John Roberts",
    role: "Chief Executive",
    href: "#",
  },
};
