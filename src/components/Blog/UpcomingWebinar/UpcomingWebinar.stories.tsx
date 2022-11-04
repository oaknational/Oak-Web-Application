import { ComponentStory, ComponentMeta } from "@storybook/react";

import Box from "../../Box";

import Component from ".";

export default {
  title: "Blogs & Webinars/UpcomingWebinar",
  component: Component,
  decorators: [
    (Story) => (
      <Box $position="relative" $maxWidth={720} $ma="auto">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    argTypes: { onClick: { action: "clicked" } },
  },
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const UpcomingWebinar = Template.bind({});
UpcomingWebinar.args = {
  headingTag: "h3",
};
