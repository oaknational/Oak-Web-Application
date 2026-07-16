import { Meta, StoryObj } from "@storybook/nextjs";

import { SocialButton as Component } from ".";

const meta: Meta<typeof Component> = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/SocialButton",
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: { socialType: "linkedin", profileHref: "https://www.linkedin.com" },
  render: (args) => <Component {...args} />,
};

export const WithMultipleSocials: Story = {
  render: () => (
    <div style={{ display: "flex" }}>
      <Component
        {...{ socialType: "linkedin", profileHref: "https://www.linkedin.com" }}
      />
      <Component {...{ socialType: "x", profileHref: "https://www.x.com" }} />
    </div>
  ),
};
