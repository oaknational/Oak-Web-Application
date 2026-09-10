import { Meta, StoryObj } from "@storybook/nextjs";

import { oaksImpactCaseStudiesFixture } from "./OaksImpactCaseStudies.fixtures";

import { OaksImpactCaseStudies as Component } from ".";

const meta = {
  component: Component,
  tags: ["autodocs"],
  title: "Components/GenericPagesComponents/OaksImpactCaseStudies",
  argTypes: {},
} satisfies Meta<typeof Component>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Explore more case studies",
    caseStudies: oaksImpactCaseStudiesFixture,
  },
  render: (args) => <Component {...args} />,
};
