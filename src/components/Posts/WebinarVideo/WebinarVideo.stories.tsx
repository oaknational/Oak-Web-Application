import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../Box";
import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";
import { mockWebinar } from "../../../__tests__/pages/webinars/webinar.fixtures";

import Component from ".";

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
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
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
