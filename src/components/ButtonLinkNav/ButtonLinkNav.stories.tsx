import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./ButtonLinkNav";

export default {
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const ButtonLinkNav = Template.bind({});

ButtonLinkNav.args = {
  buttons: [
    { label: "Who we are", href: "/first-one" },
    { label: "Board", href: "/second-one" },
    { label: "Leadership", href: "/third-one" },
  ],
};
