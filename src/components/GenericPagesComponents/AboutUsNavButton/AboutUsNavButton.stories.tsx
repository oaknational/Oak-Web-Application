import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./AboutUsNavButton";

export default {
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const AboutUsNavButton = Template.bind({});

AboutUsNavButton.args = {
  buttons: [
    { label: "Who we are", href: "/first-one" },
    { label: "Board", href: "/second-one" },
    { label: "Leadership", href: "/third-one" },
  ],
};
