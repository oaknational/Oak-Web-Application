import { Meta, StoryObj } from "@storybook/nextjs";

import { CaseStudiesSection as Component } from ".";

import { otherCaseStudies } from "@/__tests__/pages/about-us/case-studies/case-studies.fixtures";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/CaseStudiesSection",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Case studies",
    caseStudies: otherCaseStudies,
  },
  render: (args) => <Component {...args} />,
};
