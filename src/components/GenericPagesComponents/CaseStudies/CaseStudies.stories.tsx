import { Meta, StoryObj } from "@storybook/nextjs";

import { caseStudiesFixture } from "./CaseStudies.fixtures";

import { CaseStudies as Component } from ".";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/CaseStudies",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Explore more case studies",
    caseStudies: caseStudiesFixture,
  },
  render: (args) => <Component {...args} />,
};
