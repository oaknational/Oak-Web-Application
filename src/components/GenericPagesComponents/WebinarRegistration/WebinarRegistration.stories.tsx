import { StoryFn, Meta } from "@storybook/react";

import Component from ".";

import AnalyticsDecorator from "@/storybook-decorators/AnalyticsDecorator";
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

export const WebinarRegistration = Template.bind({});
WebinarRegistration.args = {
  headingTag: "h3",
};
