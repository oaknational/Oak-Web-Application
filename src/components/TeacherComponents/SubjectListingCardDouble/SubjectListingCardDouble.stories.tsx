import { Meta, StoryObj } from "@storybook/react";

import Component from ".";

import subjectPagePropsFixture from "@/node-lib/curriculum-api/fixtures/subjectPageProps";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [AnalyticsDecorator],
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectListingCardDouble: Story = {
  args: {
    subject: subjectPagePropsFixture().subjects[0],
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
  },
  render: (args) => <Component {...args} />,
};
