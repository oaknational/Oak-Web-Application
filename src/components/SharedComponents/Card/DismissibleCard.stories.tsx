import { StoryFn, Meta } from "@storybook/react";

import Component from "./DismissibleCard";

export default {
  component: Component,
  argTypes: {
    children: {
      defaultValue: "Close to remove",
    },
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const DismissibleCard = Template.bind({});
