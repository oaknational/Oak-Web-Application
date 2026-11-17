import { Meta, StoryObj } from "@storybook/react";

import TeachWithOakNewsletterForm from "./TeachWithOakNewsletterForm";

const meta = {
  component: TeachWithOakNewsletterForm,
  title: "App/TeachWithOak/TeachWithOakNewsletterForm",
} as Meta<typeof TeachWithOakNewsletterForm>;

export default meta;
export type Story = StoryObj<typeof TeachWithOakNewsletterForm>;

export const Default: Story = {
  render: () => <TeachWithOakNewsletterForm />,
};
