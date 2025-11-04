import { Meta, StoryObj } from "@storybook/nextjs";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import Component from ".";

import subjectPagePropsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";
import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

const meta: Meta<typeof Component> = {
  component: Component,
  decorators: [
    AnalyticsDecorator,
    (Story) => (
      <OakThemeProvider theme={oakDefaultTheme}>
        <Story />
      </OakThemeProvider>
    ),
  ],
  argTypes: {},
  parameters: {
    backgrounds: {
      values: [{ name: "Dark", value: "#333" }],
      default: "Dark",
    },
  },
};
export default meta;
type Story = StoryObj<typeof Component>;

export const SubjectListingCardDouble: Story = {
  args: {
    subjectPathwaysArray: subjectPagePropsFixture().subjects[4],
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
  },
  render: (args) => <Component {...args} />,
};
