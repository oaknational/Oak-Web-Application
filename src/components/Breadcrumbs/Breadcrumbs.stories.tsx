import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Breadcrumbs";

export default {
  title: "Navigation/Breadcrumbs",
  component: Component,
  argTypes: {},
} as ComponentMeta<typeof Component>;

const Template: ComponentStory<typeof Component> = (args) => (
  <Component {...args} />
);

export const Breadcrumbs = Template.bind({});
Breadcrumbs.args = {
  breadcrumbs: [
    { oakLinkProps: { href: "/", page: null }, label: "Unit Quiz" },
    { oakLinkProps: { href: "/", page: null }, label: "View In Classroom" },
    {
      oakLinkProps: { href: "/", page: null },
      label: "Foundation Curriculum (PDF)",
    },
    {
      oakLinkProps: { href: "/", page: null },
      label: "Higher Curriculum (PDF)",
    },
  ],
};
