import { Meta, StoryObj } from "@storybook/react";

import TeachWithOakNewsletterForm from "./TeachWithOakNewsletterForm";

const meta = {
  component: TeachWithOakNewsletterForm,
  title: "TeachWithOakNewsletterForm",
} as Meta<typeof TeachWithOakNewsletterForm>;

export default meta;
export type Story = StoryObj<typeof TeachWithOakNewsletterForm>;

export const Default: Story = {
  args: {
    id: "default-id",
    onSubmit: async () => undefined,
  },
  render: (args) => <TeachWithOakNewsletterForm {...args} />,
};
