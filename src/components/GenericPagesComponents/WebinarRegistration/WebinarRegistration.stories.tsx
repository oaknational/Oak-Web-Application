import { StoryFn, Meta } from "@storybook/react";
import { OakBox } from "@oaknational/oak-components";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";

export default {
  component: Component,
  decorators: [
    AnalyticsDecorator,
    (Story) => (
      <OakBox $position="relative" $maxWidth="all-spacing-22" $ma="auto">
        <Story />
      </OakBox>
    ),
  ],
  argTypes: {
    argTypes: { onSubmit: { action: "submitted" } },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const WebinarRegistration = {
  render: Template,

  args: {
    headingTag: "h3",
  },
};
