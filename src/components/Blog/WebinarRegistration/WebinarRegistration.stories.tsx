import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../Box";
import AnalyticsDecorator from "../../../storybook-decorators/AnalyticsDecorator";

import Component from ".";

export default {
  title: "Forms/WebinarRegistration",
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

export const WebinarRegistration = Template.bind({});
WebinarRegistration.args = {
  headingTag: "h3",
};
