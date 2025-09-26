import { StoryFn, Meta } from "@storybook/nextjs";
import { OakBox } from "@oaknational/oak-components";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { mockWebinar } from "@/__tests__/pages/webinars/webinar.fixtures";

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

export const WebinarVideo = {
  render: Template,

  args: {
    webinar: mockWebinar(),
  },
};

export const WebinarVideoUpcoming = {
  render: Template,

  args: {
    webinar: mockWebinar({
      date: "2053-04-14",
    }),
  },
};
