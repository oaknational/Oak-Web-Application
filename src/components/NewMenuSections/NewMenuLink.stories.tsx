import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./NewMenuLink";

export default {
  title: "Navigation/New Menu Link",
  component: Component,
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const NewMenuLink = Template.bind({});
NewMenuLink.args = {
  link: {
    resolveOakHrefProps: { page: "home", viewType: "teachers-2023" },
    text: "Home",
    new: true,
    external: false,
  },
};
