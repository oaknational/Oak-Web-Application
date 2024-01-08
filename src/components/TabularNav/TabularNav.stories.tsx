import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./TabularNav";

export default {
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const TabularNav = Template.bind({});

TabularNav.args = {
  label: "test label",
  links: [
    {
      label: "Foundation",
      page: null,
      href: "https://www.example.com",
    },
    {
      label: "Higher",
      page: null,
      href: "https://www.example.com",
    },
  ],
};
