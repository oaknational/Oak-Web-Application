import { StoryFn, Meta } from "@storybook/react";

import Component from "./GenericSummaryCardNavButton";

export default {
  component: Component,
  argTypes: {},
} as Meta<typeof Component>;

const Template: StoryFn<typeof Component> = (args) => <Component {...args} />;

export const GenericSummaryCardNavButton = Template.bind({});

GenericSummaryCardNavButton.args = {
  buttons: [
    { label: "Who we are", href: "/first-one" },
    { label: "Board", href: "/second-one" },
    { label: "Leadership", href: "/third-one" },
  ],
};
