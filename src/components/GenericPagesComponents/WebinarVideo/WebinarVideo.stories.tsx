import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
import { mockWebinar } from "@/__tests__/pages/webinars/webinar.fixtures";
import Box from "@/components/SharedComponents/Box";

export default {
  component: Component,
  decorators: [
    AnalyticsDecorator,
    (Story) => (
      <Box $position="relative" $maxWidth={720} $ma="auto">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    argTypes: { onSubmit: { action: "submitted" } },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const WebinarVideo = Template.bind({});
WebinarVideo.args = {
  webinar: mockWebinar(),
};

export const WebinarVideoUpcoming = Template.bind({});
WebinarVideoUpcoming.args = {
  webinar: mockWebinar({
    date: "2053-04-14",
  }),
};
