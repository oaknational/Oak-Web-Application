import { Meta, StoryObj } from "@storybook/nextjs";

import { OaksImpactCaseStudyHeader as Component } from ".";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactCaseStudyHeader",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Testing",
    tag: "Optional tag",
    publishedDate: "14 July 2026",
    onCopyLink: () => {},
  },
  render: (args) => <Component {...args} />,
};

export const WithSummary: Story = {
  args: {
    title: "Testing",
    tag: "Optional tag",
    publishedDate: "14 July 2026",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris.",
    onCopyLink: () => {},
  },
  render: (args) => <Component {...args} />,
};
