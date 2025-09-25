import { StoryFn, Meta } from "@storybook/nextjs";

import Component from ".";

export default {
  component: Component,
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => {
  return <Component {...args} />;
};

export const BioCardListItem = {
  render: Template,

  args: {
    name: "John Smith",
    role: "Worker",
  },
};
