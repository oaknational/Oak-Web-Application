import { Meta, StoryObj } from "@storybook/nextjs";

import { caseStudiesSectionFixture } from "./CaseStudiesSection.fixtures";

import { CaseStudiesSection as Component } from ".";

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
    title: "Explore more case studies",
    caseStudies: caseStudiesSectionFixture,
  },
  render: (args) => <Component {...args} />,
};
